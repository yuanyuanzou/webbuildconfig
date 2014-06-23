#!/bin/bash

usage()
{
    echo "Usage: `basename $0` [-l LANGUAGE] [-t TIMEZONE] [-a APK]... [-d APK]... INPUT_IMAGE OUT_IMAGE"
    exit 1
}

clean()
{
    if [ -n "`sudo mount -l | grep $MOUNT_POINT`" ]; then
        sudo umount $MOUNT_POINT
        sudo rm -rf $MOUNT_POINT
    fi
}

MOUNT_POINT=/mnt/imgcust/$$

trap clean EXIT

[ $# -eq 0 ] && usage

INPUT_IMAGE=
LANGUAGE_REGION=
TIMEZONE=
ADD_APKS=
DEL_FILES=

while getopts :l:t:a:d: OPTION
do
    case $OPTION in
        l)
            LANGUAGE_REGION=$OPTARG
            ;;
        t)
            TIMEZONE=$OPTARG
            ;;
        a)
            ADD_APKS="$OPTARG $ADD_APKS"
            ;;
        d)
            DEL_FILES="$OPTARG $DEL_FILES"
            ;;
        \?)
            usage
            ;;
    esac
done

shift $(($OPTIND - 1))
if [ $# -eq 0 ]; then
    usage
fi

INPUT_IMAGE=$1
OUT_IMAGE=$2
TEMP_IMAGE=/tmp/$$_`basename $1`
sudo cp $INPUT_IMAGE $TEMP_IMAGE

if [ -z "`file $INPUT_IMAGE | grep ext4`" ]; then
    echo "The image $INPUT_IMAGE is not ext4 filesystem."
    exit 1
fi

sudo mkdir -p $MOUNT_POINT
sudo mount -o loop $TEMP_IMAGE $MOUNT_POINT

if [ -n "$LANGUAGE_REGION" ]; then
    LANGUAGE=`echo $LANGUAGE_REGION | awk -F'_' '{print $1}'`
    REGION=`echo $LANGUAGE_REGION | awk -F'_' '{print $2}'`
    sudo sed -i "s/ro.product.locale.language=.*/ro.product.locale.language=$LANGUAGE/" $MOUNT_POINT/build.prop
    sudo sed -i "s/ro.product.locale.region=.*/ro.product.locale.region=$REGION/" $MOUNT_POINT/build.prop
fi

if [ -n "$TIMEZONE" ]; then
    echo "$TIMEZONE"
fi

if [ -n "$ADD_APKS" ]; then
    sudo cp $ADD_APKS $MOUNT_POINT/app/
fi

if [ -n "$DEL_FILES" ]; then
    for DEL in $DEL_FILES
    do
        sudo rm $MOUNT_POINT/app/$DEL
    done
fi
sudo mv $TEMP_IMAGE $OUT_IMAGE
#sudo umount $MOUNT_POINT
