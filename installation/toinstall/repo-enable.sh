#!/usr/bin/sh -x


cd /etc/yum.repos.d

ls -l 

sed 's/enabled=0/enabled=1/g' < CentOS-Base.repo > in

cp CentOS-Base.repo CentOS-Base.repo.bak
cp in CentOS-Base.repo

yum repolist

rm --interactive=never in


