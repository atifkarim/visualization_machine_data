"""Local entry point; production servers can use app:create_app."""

import os

from dashboard import create_app

app = create_app()

if __name__ == "__main__":
    app.run(host=os.getenv("HOST", "127.0.0.1"), port=int(os.getenv("PORT", "5012")))
