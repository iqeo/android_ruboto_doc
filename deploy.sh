#! /bin/sh
bundle install
sudo cp unicorn/unicorn_ard.initscript /etc/init.d/unicorn_ard
sudo chmod 700 /etc/init.d/unicorn_ard
sudo update-rc.d unicorn_ard defaults
sudo cp nginx/android-ruboto-doc.iqeo.net /etc/nginx/sites-available
sudo ln -f -s ../sites-available/android-ruboto-doc.iqeo.net /etc/nginx/sites-enabled/android-ruboto-doc.iqeo.net
sudo chmod 600 /etc/nginx/sites-available/android-ruboto-doc.iqeo.net

