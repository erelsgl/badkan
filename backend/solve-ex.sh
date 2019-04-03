FOLDERNAME=$1

docker cp $FOLDERNAME badkan:/
sudo rm $FOLDERNAME
