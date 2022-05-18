pragma solidity ^0.5.0;

contract Decentragram {
  // Code goes here...
  string public name="Dwitter";
  //Store Posts
  uint public imageCount=0;
  uint public userCount=0;
  mapping(uint=>Image) public images;
  mapping(string=>User) public users;

  struct Image{
    uint id;
    string hash;
    string description;
    uint tipAmount;
    address payable author;
    bool onSale;
    uint salePrice;
  }

  struct User{
    uint user_id;
    string user_hash;
    string user_name;
  }

  event ImageCreated(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author,
    bool onSale,
    uint salePrice
  );
  event UserCreated(
    uint id,
    string user_hash,
    string user_name
  );
  event ImageTipped(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
    );
  event ImageSold(
    uint sellingPrice,
    uint imageId
  );


  //Create Posts

  function uploadImage(string memory _imgHash, string memory _description) public {
    //make sure the image hash exists
    require(bytes(_imgHash).length>0);
    //make sure image description exists
    require(bytes(_description).length>0);
    //make sure uploader address exists
    require(msg.sender!=address(0x0));
    //increment image id
    imageCount=imageCount+1;
    //add image to contract
    images[imageCount]=Image(imageCount,_imgHash,_description,0,msg.sender,false ,0);
    //Trigger an event
    emit ImageCreated(imageCount,_imgHash,_description,0,msg.sender,false,0);
  }

  function createUser(string memory _userhash,string memory _username) public{
    require(bytes(_userhash).length>0);
    require(bytes(_username).length>0);
    userCount=userCount+1;
    users[_userhash]=User(userCount,_userhash,_username);
    emit UserCreated(userCount,_userhash,_username);

  }

  function setSellingPrice(uint  _sellingPrice,uint  _imageId) public {
    images[_imageId].onSale=true;
    images[_imageId].salePrice=_sellingPrice;
    emit ImageSold(_sellingPrice,_imageId);
  }

  //Tip Images
  function tipImageOwner(uint _id) public payable{

    //make sure the id is valid
    require(_id>0&&_id<=imageCount);
    //Fetch the images
    Image memory _image=images[_id];
    //Fetch the author
    address payable _author=_image.author;
    //pay the author by sending them ether
    address(_author).transfer(msg.value);
    // Increment the tip tipAmount
    _image.tipAmount=_image.tipAmount + msg.value;
    //update the image
    images[_id]=_image;

    //Trigger an event
    if(msg.sender!=address(_author)){
    emit ImageTipped(_id,_image.hash,_image.description,_image.tipAmount,_author);
    }
  }
  event transferedOwnership(
    address payable from,
    address payable to,
    string imageHash
  );
  function transferOwnerShip (uint _id,address payable _to) public payable{
      require(_id>0&&_id<=imageCount);
      Image memory _image=images[_id];
      address payable _tranferTo=_to;
      address payable _imageAuthor=_image.author;
      _imageAuthor.transfer(msg.value);
      _image.author=_tranferTo;
      _image.onSale=false;
      _image.salePrice=0;
      _image.tipAmount=0;
      images[_id]=_image;
      emit transferedOwnership(_imageAuthor,_tranferTo,_image.hash);
  }

}
