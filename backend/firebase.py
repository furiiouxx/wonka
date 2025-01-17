# firebase.py is used to access the remote firebase database (firestore)

import firebase_admin
from firebase_admin import credentials, firestore

# Path to your Firebase service account key JSON file
SERVICE_ACCOUNT_KEY_PATH = "./config/serviceAccountKey.json"

# Initialize the Firebase Admin SDK
if not firebase_admin._apps:  # Ensures the app isn't initialized multiple times
    cred = credentials.Certificate(SERVICE_ACCOUNT_KEY_PATH)
    firebase_admin.initialize_app(cred)

# Initialize Firestore client
firestore_client = firestore.client()





