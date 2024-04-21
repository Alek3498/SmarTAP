# .bash_profile

# Get the aliases and functions
if [ -f ~/.bashrc ]; then
	. ~/.bashrc
fi

# User specific environment and startup programs

TOOLS=/opt/SmarTAP/bin

PATH=$PATH:$HOME/bin:$TOOLS

export PATH
