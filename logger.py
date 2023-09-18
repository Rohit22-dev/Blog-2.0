import logging


# logging structure
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s %(levelname)s %(message)s',
    datefmt="%Y-%m-%d %H:%M:%S",
    filemode='w',
    filename="basic.log"
)

logger = logging.getLogger('basic')