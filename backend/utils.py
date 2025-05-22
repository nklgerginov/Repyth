import functools
import time
from datetime import datetime
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)

def timed(func):
    """
    Decorator to measure function execution time
    """
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        execution_time = end_time - start_time
        logger.info(f"Function {func.__name__} executed in {execution_time:.4f} seconds")
        return result
    return wrapper

def format_timestamp(timestamp):
    """
    Convert timestamp to ISO 8601 format
    """
    if isinstance(timestamp, str):
        try:
            timestamp = datetime.fromisoformat(timestamp)
        except ValueError:
            return timestamp
    
    if isinstance(timestamp, datetime):
        return timestamp.isoformat()
    
    return timestamp

def validate_uuid(uuid_string):
    """
    Validate if a string is a valid UUID
    """
    import uuid
    try:
        uuid_obj = uuid.UUID(uuid_string)
        return str(uuid_obj) == uuid_string
    except ValueError:
        return False

def paginate(items, page=1, page_size=10):
    """
    Simple pagination utility
    """
    start = (page - 1) * page_size
    end = start + page_size
    
    paginated_items = items[start:end]
    total = len(items)
    total_pages = (total + page_size - 1) // page_size
    
    return {
        "items": paginated_items,
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_prev": page > 1,
    }

def sanitize_string(input_string):
    """
    Sanitize a string by removing potentially harmful characters
    """
    if not input_string:
        return input_string
    
    # Remove control characters and trim whitespace
    sanitized = ''.join(c for c in input_string if c.isprintable())
    return sanitized.strip()