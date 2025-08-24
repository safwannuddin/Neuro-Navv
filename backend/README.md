# NeuroNav Backend

This is the FastAPI backend for the NeuroNav platform, handling brain scan processing and AI analysis.

## Features

- DICOM and NIfTI file upload and validation
- 3D U-Net model integration for brain scan analysis
- RESTful API endpoints for scan processing and results
- Background task processing
- Secure file handling
- Integration with Supabase for storage and database

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory with the following variables:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SECRET_KEY=your_secret_key
USE_GPU=false  # Set to true if using GPU
MODEL_PATH=models/3d_unet.pth
```

4. Run the development server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

- `POST /api/v1/upload` - Upload a brain scan
- `GET /api/v1/process/{scan_id}` - Get processing status
- `GET /api/v1/results/{scan_id}` - Get analysis results
- `GET /api/v1/model/{scan_id}` - Get 3D model data

## Development

### Project Structure

```
backend/
├── app/
│   ├── api/          # API endpoints
│   ├── core/         # Core configuration
│   ├── models/       # Pydantic models
│   ├── services/     # Business logic
│   └── utils/        # Utility functions
├── models/           # AI model files
├── uploads/          # Temporary file storage
├── requirements.txt  # Python dependencies
└── README.md        # This file
```

### Adding New Features

1. Create new endpoints in `app/api/endpoints.py`
2. Add corresponding models in `app/models/schemas.py`
3. Implement business logic in `app/services/`
4. Add utility functions in `app/utils/`

## Testing

Run tests with:
```bash
pytest
```

## Deployment

1. Build the Docker image:
```bash
docker build -t neur-nav-backend .
```

2. Run the container:
```bash
docker run -p 8000:8000 neur-nav-backend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
