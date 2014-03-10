```
//
 .____       _____ ___________________.________       ____.__________
 |    |     /  _  \\______   \______  \   ____/      |    |\______   \
 |    |    /  /_\  \|    |  _/   /    /____  \       |    | |     ___/
 |    |___/    |    \    |   \  /    //       \  /\__|    | |    |
 |_______ \____|__  /______  / /____//______  / /\________| |____|
         \/       \/       \/               \/  \/

   C 0 D 3   1 Z   P 0 3 7 R Y
```

# _Project_

_This project serves as a marketing tool for the CeBit. Users can start a Indigitus server and login via an emulated terminal_

## Project Setup

_Dependencies_

1. npm install grunt -g 
2. npm install bower -g 
3. git clone https://github.com/LAB75JP/indigitus-marketingfrontend.git
4. cd indigitus-marketingfrontend
5. npm install
6. bower install 
7. grunt serve

_Additional Dependencies_

1. Livereload https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei

## Testing

1. sudo apt-get install ssh
2. sudo adduser devtest
3. Follow the wizard and finally enter "devtest" as password
4. sudo adduser devtest ssh
5. grunt serve

_Not yet implemented_

## Deploying

 _Not yet implemented_

## Contributing changes

- _For new features open up a new branch that gives an idea about what problem you are trying to solve_
- _"Please open github issues"_

## SSH-Keys

- all required SSH keys are located in the *./lib/config/ssh/$environment/* folder.
- no password
- private key is $environment/$template.id\_rsa
- public key is $environment/$template.id\_rsa.pub
- they are all assigned to indigitus@lab75.jp

1. cd lib/config/production
2. ssh-keygen
3. ./$template.id\_rsa [Enter] # replace $template with the correct value in env.json
4. [Enter] # no passphrase
5. [Enter] # confirm no passphrase
6. Replace the local name@host inside id\_rsa.pub file with indigitus@lab75.jp


enjoy!