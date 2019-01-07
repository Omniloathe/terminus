from flask import Flask
from flask_bootstrap import Bootstrap

app=Flask(__name__)
app.config.from_object('config')
Bootstrap(app)
# Now we can access the configuration variables via app.config["VAR_NAME"].

import terminus.views