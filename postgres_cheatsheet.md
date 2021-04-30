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