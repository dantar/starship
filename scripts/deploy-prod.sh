#!/bin/bash
#set -v # do not expand variables
set -x # output
set -e # stop on error
set -u # stop if you use an uninitialized variable

TODAY=`date +%Y-%m-%d-%H-%M-%S`
echo $TODAY

HACKGIT=~/hack/git

export JAVA_HOME=/usr/lib/jvm/java-8-oracle

REMOTE="ssh ada-ubuntu-devel "

cd $HACKGIT/starship/starship-rest
mvn clean install

APPNAME=dantar-starship

$REMOTE sudo /etc/init.d/$APPNAME stop
$REMOTE cp boot-services/$APPNAME.jar backup/boot-services/$APPNAME-$TODAY.jar
scp $HACKGIT/starship/starship-rest/target/starship-rest-0.0.1-SNAPSHOT.jar ada-ubuntu-devel:boot-services/$APPNAME.jar
$REMOTE sudo /etc/init.d/$APPNAME start

cd $HACKGIT/starship/starship-ng
ng build --base-href=./ --prod

rsync --delete -varzh $HACKGIT/starship/starship-ng/dist/starship-ng/* ada-ubuntu-devel:/var/www/html/starship/

