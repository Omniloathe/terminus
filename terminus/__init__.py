from flask import Flask
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy

app=Flask(__name__)
app.config.from_object('config')
db=SQLAlchemy(app)
Bootstrap(app)

# Now we can access the configuration variables via app.config["VAR_NAME"].

import terminus.views