from terminus import app
from flask import render_template

testposts=['Iraeneus Argument','Modus Ponens','Monty Python Witch Proof']


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html',posts=testposts)

@app.route('/about')
def about():
    return render_template('about.html',title='About Terminus')



#probably doesn't work
@app.route('/newarg')
def new_arg():
    return render_template('newargument.html')