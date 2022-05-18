import React, { Component } from "react";
import Identicon from "identicon.js";
import Button from "@material-ui/core/Button";
// import TextField from "@mui/material/TextField";
import TextField from "@material-ui/core/TextField"


class Main extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       tipAmount:1,
       sellingPrice:1,
       setPrice:9
    }
  }
  handleSellClick=(imageID)=>{
    console.log();
    this.props.setSellingPrice(this.state.sellingPrice, imageID);
  }
  
  render() {
    return (
      <div className="container-fluid mt-5">
       
        <div className="row">
          <main
            role="main"
            className="col-lg-12 ml-auto mr-auto"
            style={{ maxWidth: "500px" }}
          >
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>
              <h2>Share Image</h2>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const description = this.imageDescription.value;
                  this.props.uploadImage(description);
                }}
              >
                <input
                  type="file"
                  accept=".jpg, .jpeg, .png, .bmp, .gif"
                  onChange={this.props.captureFile}
                />
                <div className="form-group mr-sm-2">
                  <br></br>
                  <input
                    id="imageDescription"
                    type="text"
                    ref={(input) => {
                      this.imageDescription = input;
                    }}
                    className="form-control"
                    placeholder="Image description..."
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">
                  Upload!
                </button>
              </form>
              <p>&nbsp;</p>
              {this.props.images.map((image, key) => {
                return (
                  <div className="card mb-4" key={key}>
                    <div className="card-header">
                      <img
                        className="mr-2"
                        alt=""
                        width="30"
                        height="30"
                        src={`data:image/png;base64,${new Identicon(
                          image.author,
                          30
                        ).toString()}`}
                      />
                      <small className="text-muted">{image.author}</small>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {console.log(image.id)}
                      <Button
                        variant="contained"
                        color="secondary"
                        style={{ flexGrow: "1" }}
                        disabled={
                          image.author !== this.props.author ||
                          image.onSale !== false
                        }
                        onClick={()=>this.handleSellClick(image.id)}
                      >
                        Sell
                      </Button>
                      <Button
                      disabled={image.author===this.props.author||image.onSale==false}
                        variant="contained"
                        color="primary"
                        style={{ flexGrow: "1" }}
                        onClick={()=>this.props.transferOwnership(image.id,(image.salePrice))}
                      >
                        Buy
                      </Button>
                    </div>
                    <br></br>
                    {image.onSale?(<h4>Selling Price: {parseInt(image.salePrice)} ETH</h4>):<div><TextField
                    
                      disabled={
                        image.author !== this.props.author ||
                        image.onSale !== false
                      }
                      onChange={e=>{this.setState({sellingPrice:e.target.value})
                    console.log(this.state.sellingPrice)}}
                      placeholder="enter sell value"
                      type="number"
                      defaultValue="1"
                    /></div>}
                    
                    <ul id="imageList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p className="text-center">
                          <img
                            alt=""
                            src={`https://ipfs.io/ipfs/${image.hash}`}
                            style={{ maxWidth: "420px" }}
                          />
                        </p>
                        <p>{image.description}</p>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                          TIPS:{" "}
                          {window.web3.utils.fromWei(
                            image.tipAmount.toString(),
                            "Ether"
                          )}{" "}
                          ETH
                        </small>
                        <br />
                        <input
                          defaultValue={1}
                          type="number"
                          onChange={(e) => {
                            this.setState({
                              tipAmount: e.target.value,
                            });
                          }}
                        />
                        <button
                          disabled={image.author === this.props.author}
                          className="btn btn-link btn-sm float-right pt-0"
                          name={image.id}
                          onClick={(event) => {
                            let tipAmount = window.web3.utils.toWei(
                              `${this.state.tipAmount}`,
                              "Ether"
                            );
                            console.log("Bruh", event.target.name, tipAmount);
                            console.log("Image author", image.author);
                            this.props.tipImageOwner(
                              event.target.name,
                              tipAmount
                            );
                          }}
                        >
                          TIP
                        </button>
                      </li>
                    </ul>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;
