# Terminal command regarding PostgreSQL

## Install PostgreSQL
### Contet taken from [here](https://www.fullstackpython.com/blog/postgresql-python-3-psycopg2-ubuntu-1604.html)
* Open terminal anf follow the commands  
`sudo apt-get update`  
`sudo apt-get install postgresql libpq-dev postgresql-client postgresql-client-common`  
now check whether postgresql is installed or not by the following command  
`whereis postgres`  
`whereis postgresql`  
* To check all installed package related to postgresql   
`dpkg -l | grep postgres`  

## Uninstall PostgreSQL
### Contet taken from [here](https://askubuntu.com/questions/32730/how-to-remove-postgres-from-my-installation#:~:text=One%20command%20to%20completely%20remove,postgresql%20and%20all%20it's%20compenents.)
* One line solution  
`sudo apt-get --purge remove postgresql\*`  
* Run next command to check any package is remained uninstalled or not  
`dpkg -l | grep postgres`  
If it shows any output then try next command  
`sudo apt-get --purge remove package_name_1 package_name_2 package_name_n`  
To delete postgres user try  
`sudo userdel -f postgres`

## Commands regarding PSQL as well as creation of DB, ROLE, TABLE and others

* check the default database and role  
First of all terminal is as like as  
`user_name@user_name:~$`  
Now write  
`sudo -i -u postgres`  
This will ask for password for the main/ user account. After giving password terminal will be  
`postgres@user_name:~$`  
Now write  
`psql`  
Terminal will be  
`postgres=#`  
It means system is now connected with `postgres` database. Here if write  
`\conninfo`  
all information of connection will be printed. In my case it is  
`You are connected to database "postgres" as user "postgres" via socket in "/var/run/postgresql" at port "5432".`

* Instead of former point the folowing is also possible  
`sudo -u postgres psql`  
* Also try from `postgres=#` terminal  
`\l` - to get the list of all database  
`\du` or `\du+` to get the list of all role/user

* <ins> Here one thing to be concern that **postgres** is a role as well as a database. Initially I was confused with this.</ins>

* I prefer to change the password of `postgres` by using the following command from `user_name@user_name:~$`  
`sudo passwd postgres`  
This `postgres` is the server of the postgresql. You can check it by using the following command  
`compgen -u`  

* Now anyone can connect to database by the following command  
`psql -U role_name -d database_name`  
eg: `psql -U postgres -d postgres`  
But it throws an error  `psql: FATAL:  Peer authentication failed for user "postgres"`  

* To fix this I have follwed the next steps  
1/ First connect to the database by  
`sudo -u postgres psql`  
2/ Now change the passoword of the role OR user `postgres` by  
`ALTER USER postgres with PASSWORD 'your_password';`  
3/ Now change a file which is located at  
`sudo vim /etc/postgresql/9.5/main/pg_hba.conf`  
Keep in mind that maybe in your case *9.5* could be another number whcih is nothing but the version number. Here change the following line  
```

# Database administrative login by Unix domain socket
local   all             postgres                                peer

```

to 

```

# Database administrative login by Unix domain socket
local   all             postgres                                md5

```

4/ Then by pressing `Ctrl+D` quit the connection and come to the main user terminal and restart the postgresql server by  
`sudo service postgresql restart`  
5/ Now try again  
`psql -U postgres -d postgres`  
whic require the password which you have set a few moment ago.

### It is better to create own user/ role name. Also good to set the name as the main account name

Below necessary commands are written:  
1/ Log in to postgres server  
`sudo -i -u postgres`  
2/ `createuser user_name -s -P --interactive`  
set password for new user (2 time) then give password for `postgres` role.  
3/ `Ctrl+D` and come to main account.  
4/ Open `sudo vim /etc/postgresql/9.5/main/pg_hba.conf`  and add line after the former edited line  
<pre>local      all      user_name            md5</pre>  
5/ Restart service `sudo service postgresql restart`  
6/ Now try  
`psql -U user_name -d postgres`  
will connect to postgres database.  
7/ From `postgres=#` try `\conninfo`. Output will be  
`You are connected to database "postgres" as user "user_name" via socket in "/var/run/postgresql" at port "5432".`


## Work With Flask, PostgreSQL, SQLAlchemy

First of all install the required library. Preferabe to check the version before installing python pakage with `pip` by the following command  
`pip install package name==`  
I am not mentioning here the package name.  


* At first create another role or user  
```
sudo -i -u postgres
createuser testdb -s -P --interactive
# Choose password for new role and close the connection with Ctrl+D
```
* Add the `testdb` in file `sudo vim /etc/postgresql/9.5/main/pg_hba.conf`.
```
# Database administrative login by Unix domain socket
local   all             testdb                                  md5
```

and restart ŵith `sudo service postgresql restart`.

* Now time to create a database for `testdb`role. For this follow the steps  
```
psql -U testdb -d postgres
# it will connet the testdb role with postgres database
CREATE DATABASE flask_viz;
# close the connection with Ctrl+D
```

