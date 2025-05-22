from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import uuid
import os
import json
from pathlib import Path

# Create data directory if it doesn't exist
data_dir = Path("data")
data_dir.mkdir(exist_ok=True)

# Initialize FastAPI app
app = FastAPI(title="PerfectStack API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security configuration
SECRET_KEY = "a91c0c9f5e6d16a9ef80ccfa40cbc1c9d7ad7f7e5e7b0e9a8a1b1c2d4e7f5g6"  # In production, use a secure key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# Database file paths
USERS_FILE = data_dir / "users.json"
TASKS_FILE = data_dir / "tasks.json"

# Initialize database files if they don't exist
if not USERS_FILE.exists():
    with open(USERS_FILE, "w") as f:
        json.dump([], f)

if not TASKS_FILE.exists():
    with open(TASKS_FILE, "w") as f:
        json.dump([], f)

# Models
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    created_at: datetime

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TaskBase(BaseModel):
    title: str
    description: str = ""
    completed: bool = False

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

class Task(TaskBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

# Helper functions
def read_users():
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def write_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, default=str)

def read_tasks():
    with open(TASKS_FILE, "r") as f:
        return json.load(f)

def write_tasks(tasks):
    with open(TASKS_FILE, "w") as f:
        json.dump(tasks, f, default=str)

def get_user_by_email(email: str):
    users = read_users()
    for user in users:
        if user["email"] == email:
            return UserInDB(**user)
    return None

def get_user_by_id(user_id: str):
    users = read_users()
    for user in users:
        if user["id"] == user_id:
            return UserInDB(**user)
    return None

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def authenticate_user(email: str, password: str):
    user = get_user_by_email(email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user_by_id(user_id)
    if user is None:
        raise credentials_exception
    return user

# Auth routes
@app.post("/api/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    # Check if user already exists
    db_user = get_user_by_email(user_data.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Create new user
    user_id = str(uuid.uuid4())
    new_user = {
        "id": user_id,
        "email": user_data.email,
        "name": user_data.name,
        "hashed_password": get_password_hash(user_data.password),
        "created_at": datetime.utcnow(),
    }
    
    # Save user to database
    users = read_users()
    users.append(new_user)
    write_users(users)
    
    # Create and return access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_id}, expires_delta=access_token_expires
    )
    
    # Return token and user data
    user_out = User(
        id=new_user["id"],
        email=new_user["email"],
        name=new_user["name"],
        created_at=new_user["created_at"],
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_out,
    }

@app.post("/api/auth/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    # Return token and user data
    user_out = User(
        id=user.id,
        email=user.email,
        name=user.name,
        created_at=user.created_at,
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_out,
    }

@app.get("/api/auth/me", response_model=User)
async def get_me(current_user: UserInDB = Depends(get_current_user)):
    return User(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        created_at=current_user.created_at,
    )

# Task routes
@app.get("/api/tasks", response_model=List[Task])
async def get_tasks(current_user: UserInDB = Depends(get_current_user)):
    tasks = read_tasks()
    user_tasks = [task for task in tasks if task["user_id"] == current_user.id]
    
    # Convert string dates to datetime objects
    for task in user_tasks:
        task["created_at"] = datetime.fromisoformat(task["created_at"]) if isinstance(task["created_at"], str) else task["created_at"]
        task["updated_at"] = datetime.fromisoformat(task["updated_at"]) if isinstance(task["updated_at"], str) else task["updated_at"]
    
    return user_tasks

@app.post("/api/tasks", response_model=Task, status_code=status.HTTP_201_CREATED)
async def create_task(task_data: TaskCreate, current_user: UserInDB = Depends(get_current_user)):
    now = datetime.utcnow()
    new_task = {
        "id": str(uuid.uuid4()),
        "user_id": current_user.id,
        "title": task_data.title,
        "description": task_data.description,
        "completed": task_data.completed,
        "created_at": now,
        "updated_at": now,
    }
    
    tasks = read_tasks()
    tasks.append(new_task)
    write_tasks(tasks)
    
    return new_task

@app.get("/api/tasks/{task_id}", response_model=Task)
async def get_task(task_id: str, current_user: UserInDB = Depends(get_current_user)):
    tasks = read_tasks()
    for task in tasks:
        if task["id"] == task_id and task["user_id"] == current_user.id:
            # Convert string dates to datetime objects
            task["created_at"] = datetime.fromisoformat(task["created_at"]) if isinstance(task["created_at"], str) else task["created_at"]
            task["updated_at"] = datetime.fromisoformat(task["updated_at"]) if isinstance(task["updated_at"], str) else task["updated_at"]
            return task
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Task not found",
    )

@app.patch("/api/tasks/{task_id}", response_model=Task)
async def update_task(task_id: str, task_update: TaskUpdate, current_user: UserInDB = Depends(get_current_user)):
    tasks = read_tasks()
    for i, task in enumerate(tasks):
        if task["id"] == task_id and task["user_id"] == current_user.id:
            # Update fields if provided
            if task_update.title is not None:
                task["title"] = task_update.title
            if task_update.description is not None:
                task["description"] = task_update.description
            if task_update.completed is not None:
                task["completed"] = task_update.completed
            
            # Update the updated_at timestamp
            task["updated_at"] = datetime.utcnow()
            
            # Save the updated tasks
            write_tasks(tasks)
            
            # Convert string dates to datetime objects for response
            task["created_at"] = datetime.fromisoformat(task["created_at"]) if isinstance(task["created_at"], str) else task["created_at"]
            task["updated_at"] = datetime.fromisoformat(task["updated_at"]) if isinstance(task["updated_at"], str) else task["updated_at"]
            
            return task
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Task not found",
    )

@app.delete("/api/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: str, current_user: UserInDB = Depends(get_current_user)):
    tasks = read_tasks()
    for i, task in enumerate(tasks):
        if task["id"] == task_id and task["user_id"] == current_user.id:
            # Remove the task
            tasks.pop(i)
            
            # Save the updated tasks
            write_tasks(tasks)
            
            return None
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Task not found",
    )

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "version": "0.1.0"}

# Root API endpoint
@app.get("/api")
async def api_root():
    return {
        "message": "Welcome to PerfectStack API",
        "version": "0.1.0",
        "documentation": "/docs",
    }

# Root endpoint redirects to docs
@app.get("/")
async def root():
    return {"message": "API is running. Visit /docs for documentation."}