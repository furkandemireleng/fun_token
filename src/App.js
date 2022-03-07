import './App.css';
import {ERC20_CONTRACT_ADDRESS_GANACHE, ERC20_CONTRACT_ABI} from "./config";
import React, {Component} from "react";
import Web3 from "web3";

class App extends Component {

    async loadBlockchainData() {
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        const accounts = await web3.eth.getAccounts();
        console.log(accounts[0]);
        this.setState({account: accounts[0]});
        console.log("state", this.state.account);

        //this.setState({account: accounts[0]});

        web3.eth.getBalance(accounts[0], function (err, result) {
            if (err) {
                console.log(err)
            } else {
                console.log(web3.utils.fromWei(result, "ether") + " ETH")
            }
        })

        let furkanToken = new web3.eth.Contract(ERC20_CONTRACT_ABI, ERC20_CONTRACT_ADDRESS_GANACHE);
        this.setState({furkanToken});
        console.log(furkanToken);

        const balance = await furkanToken.methods.balanceOf(this.state.account).call();
        this.setState({balance: balance});
        console.log(balance);


        // const registeredVoter = await this.state.simpleDao.methods.registeredVoter(this.state.account).call({gasLimit: 3000000});
        // console.log("name", registeredVoter.name);
        // console.log("isVoted", registeredVoter.isVoted);

        // const daoReason = await simpleDao.methods.DAOReason().call({gasLimit: 3000000});
        // const daoTitle = await simpleDao.methods.DAOTitle().call({gasLimit: 3000000});

        // this.setState({reason: daoReason});
        // this.setState({title: daoTitle});

        // this.setState({voterName: registeredVoter.name});
        // this.setState({isVoted: registeredVoter.isVoted});
        //
        //
        // this.setState({loading: false});


    }

    async transfer() {
        await this.state.furkanToken.methods.transfer("0x969f7A95f1d0336333d40c702CC80f040BA1e9Bc", 10).send({from: this.state.account})
            .once('receipt', (receipt) => {
                console.log(receipt);
                alert(receipt.transactionHash);
                this.balance();
            });
    }

    async balance() {
        const balance = await this.state.furkanToken.methods.balanceOf(this.state.account).call();
        this.setState({balance: balance});
        console.log(balance);
    }


    timer() {
        this.setState({
            currentCount: this.state.currentCount - 1
        })
        if (this.state.currentCount < 1) {
            clearInterval(this.intervalId);
            this.endGame();
            this.balance();
        }
    }

    componentDidMount() {
        this.loadBlockchainData();
    }

    componentWillUnmount() {
        console.log("buradasiniz");
        clearInterval(this.intervalId);
        clearInterval(this.balance);
    }

    playGame() {
        console.log("started");
        let text = "Playing"
        this.setState({playText: text});
        this.intervalId = setInterval(this.timer.bind(this), 1000);

    }

    endGame() {
        console.log("ended");
        let text = "Ended"
        this.setState({playText: text});
        this.transfer();
    }


    constructor(props) {
        super(props);
        this.state = {currentCount: 5}
        this.transfer = this.transfer.bind(this);
        this.balance = this.balance.bind(this);
        this.playGame = this.playGame.bind(this);
        this.endGame = this.endGame.bind(this);
    }

    render() {
        return (
            <div className="App">

                <h2 className="display-2"> Fun TOKEN</h2>


                <button className={"btn btn-success"} onClick={this.playGame}>Play game!</button>

                <h4 className="display-4">Balance:{this.state.balance}</h4>


                {
                    this.state.currentCount < 1
                        ? <p className={"lead text-danger"}> {this.state.playText}</p>
                        : <p className={"lead text-success"}>{this.state.playText}</p>
                }
                <p className={"lead"}>{this.state.currentCount}</p>

            </div>
        );

    }


}

export default App;
