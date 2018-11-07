import os
from dotenv import load_dotenv
load_dotenv()

DEBUG = True
DIRNAME = os.path.dirname(__file__)
STATIC_PATH = os.path.join(DIRNAME, 'static')
TEMPLATE_PATH = os.path.join(DIRNAME, 'templates')
CODEWARS_KEY = os.getenv("CODEWARS_API_KEY")
CODEWARS_URL = os.getenv("CODEWARS_URL")
CODEWARS_USER = os.getenv("CODEWARS_USER")
