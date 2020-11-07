#!/bin/bash
#set -v # do not expand variables
set -x # output
set -e # stop on error
set -u # stop if you use an uninitialized variable

TODAY=`date +%Y-%m-%d-%H-%M-%S`
echo $TODAY

HACKGIT=~/hack/git

export JAVA_HOME=/usr/lib/jvm/java-8-oracle

REMOTE="ssh dantar "

cd $HACKGIT/starship/starship-rest
mvn clean install

cd $HACKGIT/starship/starship-ng
ng build --base-href=./ --prod

APPNAME=dantar-starship

$REMOTE sudo /etc/init.d/$APPNAME stop
$REMOTE cp services/$APPNAME.jar backup/services/$APPNAME-$TODAY.jar
scp $HACKGIT/starship/starship-rest/target/starship-rest-0.0.1-SNAPSHOT.jar dantar:services/$APPNAME.jar
$REMOTE sudo /etc/init.d/$APPNAME start

rsync --delete -varzh $HACKGIT/starship/starship-ng/dist/starship-ng/* dantar:/home/daniele/html/starship/

