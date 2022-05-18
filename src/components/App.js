import React, { Component } from "react";
import Web3 from "web3";
import Identicon from "identicon.js";
import "./App.css";
import Decentragram from "../abis/Decentragram.json";
import Navbar from "./Navbar";
import Main from "./Main";

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values


class App extends Component {
  
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  //Just how to load web3 and metamask, copied from metamask website.
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    //load account
    const accounts = await web3.eth.getAccounts();
    console.log("rightnow",accounts[0]);
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const networkData = Decentragram.networks[networkId];
    if (networkData) {
      const decentragram = web3.eth.Contract(
        Decentragram.abi,
        networkData.address
      );
      this.setState({ decentragram });
      const imageCount = await decentragram.methods.imageCount().call();
      console.log(imageCount)
      this.setState({ imageCount });


      //load images
      for (var i = 1; i <= imageCount; i++) {
        const image = await decentragram.methods.images(i).call();
        this.setState({
          images: [...this.state.images, image],
        });
        console.log(this.state.images);
      }

      //sort images. Show highest tipped images first
      this.setState({
        images:this.state.images.sort((a,b)=>b.tipAmount-a.tipAmount)
      })

      const userCount=await decentragram.methods.userCount().call();
      console.log(userCount)
      // const user=
      // console.log();
      const user = await decentragram.methods.users(this.state.account).call();
      console.log(user)
      if(user[1]!=='') this.setState({username:user[2]})

      this.setState({ loading: false });
    } else {
      window.alert("Decentragram contract not deployed to detected network.");
    }
  }

  captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("buffer", this.state.buffer);
    };
  };

  uploadImage = (description) => {
    console.log("Submitting file to ipfs...");

    //adding file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log("Ipfs result", result);
      if (error) {
        console.error(error);
        return;
      }

      this.setState({ loading: true });
      // add it to the local blockchain,send is used to make transaction in the blockchain
      this.state.decentragram.methods
        .uploadImage(result[0].hash, description)
        .send({ from: this.state.account })
        .on("transactionHash", (hash) => {
          this.setState({ loading: false });
        });
    });
  };
  createUser=(username)=>{
    console.log("creating user")
    this.setState({loading:true});

      this.state.decentragram.methods
        .createUser(this.state.account, username)
        .send({ from: this.state.account })
        .on("transactionHash", (hash) => {
          this.setState({ loading: false });
        });
  }

  tipImageOwner=(id, tipAmount) =>{
    console.log("tipImageOwner",tipAmount)
    console.log("to send it to,",id," from ", this.state.account)
    this.setState({ loading: true });
    this.state.decentragram.methods
      .tipImageOwner(id)
      .send({ from: this.state.account, value: tipAmount })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  }
  transferOwnership=(imageID,price)=>{
    price = window.web3.utils.toWei(price.toString(), "Ether");
    console.log("transferOwnership",imageID)
    this.setState({loading:true});
    this.state.decentragram.methods
      .transferOwnerShip(imageID, this.state.account)
      .send({ from: this.state.account, value: price })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  }

  constructor(props) {
    super(props);

    this.state = {
      account: "",
      decetragram: null,
      images: [],
      loading: true,
      username:null
    };
  }
  filterPosts=async (account)=>{

    const web3 = window.web3;
     const networkId = await web3.eth.net.getId();
     const networkData = Decentragram.networks[networkId];
    const decentragram = web3.eth.Contract(
      Decentragram.abi,
      networkData.address
    );

      this.setState({images:[]})
      //load images
    if(account!==''){
      for (var i = 1; i <= this.state.imageCount; i++) {
        const image = await decentragram.methods.images(i).call();
        console.log(image)
        
        if(image&&image[4]===account){
        this.setState({
          images: [...this.state.images, image],
        });
        console.log(this.state.images);
      }}
    }
    else{
      for (var i = 1; i <= this.state.imageCount; i++) {
        const image = await decentragram.methods.images(i).call();
        console.log(image);

       
          this.setState({
            images: [...this.state.images, image],
          });
          console.log(this.state.images);
        
      }
    }

      //sort images. Show highest tipped images first
      this.setState({
        images:this.state.images.sort((a,b)=>b.tipAmount-a.tipAmount)
      })
  }

  setSellingPrice=async (sellingPrice,imageId)=>{
    console.log(sellingPrice,imageId)
    this.setState({loading:true})
    await this.state.decentragram.methods
      .setSellingPrice(sellingPrice, imageId)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
    this.setState({loading:false})
  }
  
  render() {
    return (
      <div>
        {console.log(this.state.account)}
        <Navbar account={this.state.account} createUser={this.createUser} username={this.state.username} filterPosts={this.filterPosts}/>
        {this.state.loading ? (
          <div id="loader" className="text-center mt-5">
            <p>Loading...</p>
          </div>
        ) : (
          <Main
            transferOwnership={this.transferOwnership}
            setSellingPrice={this.setSellingPrice}
            author={this.state.account}
            images={this.state.images}
            captureFile={this.captureFile}
            uploadImage={this.uploadImage}
            tipImageOwner={this.tipImageOwner}
          />
        )}
      </div>
    );
  }
}

export default App;
