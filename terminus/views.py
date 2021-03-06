from terminus import app
from flask import render_template, session, redirect, url_for
from terminus.forms import LoginForm

testposts=['Iraeneus Argument','Modus Ponens','Monty Python Witch Proof']

def my_render():
    pass


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html',posts=testposts)

@app.route('/about')
def about():
    return render_template('about.html',title='About Terminus')

@app.route('/login',methods=['GET','POST'])
def login():
    loginform=LoginForm()
    if loginform.validate_on_submit():
        session['username']=loginform.username.data
        return redirect(url_for('index'))
    return render_template('login.html',loginform=loginform)



@app.route('/newarg')
def new_arg():
    return render_template('newargument.html')

@app.route('/jstest')
def js_test():
    return render_template('jstest.html')


#error handling

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html',e=e), 404

@app.errorhandler(500)
def internal_service_error(e):
    return render_template('500.html',e=e), 500