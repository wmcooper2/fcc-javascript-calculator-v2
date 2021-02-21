import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
let buttonKeys = [
 	{	name: "one", 		value: "1"},
 	{	name: "two", 		value: "2"},
 	{	name: "three", 	value: "3"},
 	{ name: "four", 	value: "4"},
 	{ name: "five", 	value: "5"},
 	{ name: "six", 		value: "6"},
 	{ name: "seven", 	value: "7"},
 	{ name: "eight", 	value: "8"},
 	{ name: "nine", 	value: "9"},
 	{ name: "zero", 	value: "0"},
 	{ name: "add", 		value: "+"},
 	{ name: "subtract", value: "-"}, 
 	{ name: "multiply", value: "x"},
 	{ name: "divide", 	value: "/"},
 	{ name: "decimal", 	value: ".", content: "."},
	{ name: "equals", 	value: "=", content: "="},
	{ name: "clear", 		value: "clear"}
];
let NONZERO = "123456789";
let NUMBERS = "0123456789";
let NUMBERSANDDOT = "0123456789.";
let OPERATORS = "+-x/";
let OPERATORSANDDOT = "+-x/.";
let DOT = ".";
let EQUAL = "=";
let MINUS = "-";
let ZERO = "0";
let CLEAR = "clear";
let MAXNUMLENGTH = 20;

let decReg = /[.]/;
let numReg = /[1-9]/;
let oneOpReg = /^[+-x/]$/;
let twoOpReg = /^[+-x/]-/;
let zeroReg = /^0$/;
let onlyMinReg = /^-$/;
let negReg = /^[+-x/]-/;
let formEndSwapReg = /[+-x/]+$/;
let equalReg = /=/;


const Key = props => {
	return(<div className="press" id={props.name} onClick={props.onClick}>{props.content}</div>);
};

//this doesn't make ANY sense... can't delete this or the whole thing doesnt work
let keys = [];
for (key of buttonKeys){
	keys.push(<Key name={key.name}/>);
}

class Calculator extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			FOR: ZERO,
			DIS: ZERO,
		};
		this.makeKeys = this.makeKeys.bind(this);
		this.toNum = this.toNum.bind(this);
		this.clicks = this.clicks.bind(this);
		this.init = this.init.bind(this);
		this.zero = this.zero.bind(this);
		this.dot = this.dot.bind(this);
		this.op = this.op.bind(this);
 		this.num = this.num.bind(this);
		this.answer = this.answer.bind(this); 
	}

	
	
	zero(){
		let form = this.state.FOR;
		let dis = this.state.DIS;
		if (equalReg.test(form)){						// "=" in form
			this.setState({FOR: ZERO});					// set to "0"
			this.setState({DIS: ZERO});					// set to "0"
			
		} else {														// "=" not in form
			if (zeroReg.test(dis)){									// dis is 0
				// do nothing
			} else if (!zeroReg.test(dis)){					// dis is not 0   //OPR, NUM or "0."
				console.log("dis not 0");
				// if (oneOpReg.test(dis)){ 								// dis is single op
				if (dis == "+" || dis == "-" || dis == "x" || dis == "/"){ 								// dis is single op
					console.log("its one op");
					this.setState({FOR: form + dis});				// append dis to form
					this.setState({DIS: ZERO});							// dis becomes value
				} else if (twoOpReg.test(dis)){					// dis is two ops
					console.log("its two ops");
					this.setState({FOR: form + dis});				// append dis to form
					this.setState({DIS: ZERO});							// dis becomes value
				} else if (!isNaN(dis)){								// dis number, includes "0."
					console.log("its a number");
					this.setState({DIS: dis + ZERO});				// append value to dis
					this.setState({FOR: form + ZERO});			// append zero to form
				}
			}
		}
	}//end zero()

	
	dot(){
		console.log("dot clicked");
		let form = this.state.FOR;
		if (equalReg.test(form)){						// "=" in form
			this.setState({FOR: "0."});				// set to "0."
			this.setState({DIS: "0."});				// set to "0."
		} else {													// no "=" in form
			let dis = this.state.DIS;
			let form = this.state.FOR;
			if (!isNaN(dis)){									// dis is any number
				if (decReg.test(dis)){						// already contains dec
					// do nothing
					console.log("contains .")
				} else {													// dis doesn't have dec yet
					console.log("no dot yet")
					this.setState({DIS: dis + "."});	// append dot to dis
					this.setState({FOR: form + "."}); // append dot to form
				}
			} else if (isNaN(dis)){							// dis is one or two ops
				this.setState({FOR: form + dis});		// append dis to form
				this.setState({DIS: "0."});					// dis becomes "0."
			}
		}
	}//end dot()
	
	
	op(oper){
		let form = this.state.FOR;
		let dis = this.state.DIS;
		if (equalReg.test(form)){						// "=" in form
			this.setState({FOR: dis+oper});				// set to dis and oper
			this.setState({DIS: oper});				// set to oper
		} else {
			let dis = this.state.DIS;
			let form = this.state.FOR;
			if (zeroReg.test(dis) && zeroReg.test(form)){		// dis == "0" && form == "0"
				this.setState({FOR: form + oper});							// append op to form
				this.setState({DIS: oper});										// dis becomes op

			} else if (!isNaN(dis)){												// dis is any number
				if (zeroReg.test(form)){												// form is "0"
					this.setState({FOR: dis});											// replace form with dis
					this.setState({DIS: oper})											// dis becomes op
				} else{																				// form not "0"
					this.setState({FOR: form + oper});							// append op to form
					this.setState({DIS: oper});									// dis becomes op
				}

			} else if (oneOpReg.test(dis)){									// dis is single op
				if (oper == MINUS){															// oper is minus sign
					if (onlyMinReg.test(dis)){											// dis is only minus
						// do nothing
					} else {																				// dis not only minus
						this.setState({DIS: dis + oper});							// append minus to dis
						this.setState({FOR: form + oper});						// append minus to form
					}
				} else {																				// oper not minus sign
					this.setState({DIS: oper});										// dis becomes new op
					this.setState({FOR: form.slice(0, form.length-1) + oper});//swap the op on form
				}

			} else if (twoOpReg.test(dis)){									// if dis is two operators
				if (oper == MINUS){														// value is minus, do nothing
				} else {																				// value is + x /
					this.setState({DIS: oper});										// replace dis with op
					this.setState({FOR: form.slice(0, form.length-2) + oper});//swap the op on form
				}
			}
		}
	}//end op()
	
	
	num(value){		
		let form = this.state.FOR;
		if (equalReg.test(form)){						// "=" in form
			this.setState({FOR: value});				// set to "0."
			this.setState({DIS: value});				// set to "0."
		} else {
			let dis = this.state.DIS;
			let form = this.state.FOR;
			if (zeroReg.test(dis) && zeroReg.test(form)){		// dis and form is 0
				this.setState({DIS: value});										// dis becomes value
				this.setState({FOR: value});										// form becomes value
			} else if (!isNaN(dis)){												// dis is any number
				this.setState({DIS: dis + value});							// append value to dis
				this.setState({FOR: form + value});							// append value to form
			} else if (isNaN(dis)){													// dis is one or two ops
				this.setState({FOR: form + value});								// append dis to form
				this.setState({DIS: value});										// dis becomes value
			}
		}
	}//end num()
	
	
	answer(){
		//console.log("equals clicked");
		let dis = this.state.DIS;
		let form = this.state.FOR;
		
		if (zeroReg.test(dis) && zeroReg.test(form)){		//dis and form is 0 			
			//do nothing
		} else {
			if (!isNaN(dis)){																// if display is a number
				console.log(form);
				let newTemp = form.replace("x", "*");						// replace x with *
				console.log(newTemp);
				let ans = eval(newTemp);												// evaluate
				console.log(ans);
				this.setState({FOR: form + "=" + ans});					// push =ans to form
				this.setState({DIS: ans});											// dis becomes ans
			}
		}
	}
	
	
	init(){
		this.setState({
			FOR: ZERO,
			DIS: ZERO,
		});
	}//end init()
	
	
	toNum(str){
		if (str.includes(DOT)){
			return parseFloat(str, 10);
		} else {
			return parseInt(str, 10);
		}
	}// end toNum()
	
	
	// set up the key pad
	makeKeys = () => {
		let temp = [];
		for (let thing of buttonKeys){
			temp.push(<Key 
									name={thing.name} 
									onClick={this.clicks} 
									content={thing.content}/>
							 );
		}
		return temp;
	} //end makeKeys()
	
	
	clicks(event){
		let target = event.target.id;
		let obj = buttonKeys.filter(el => el.name == target);
		let value = obj[0].value;
		//console.log(value);

		if (NONZERO.includes(value)){this.num(value);}
		else if (ZERO.includes(value)){this.zero();}
		else if (DOT.includes(value)){this.dot(value);}
		else if (OPERATORS.includes(value)){this.op(value);}
		else if (EQUAL.includes(value)){this.answer();}
		else if (CLEAR.includes(value)){this.init();}
	} //end clicks()
	
	render(){
		return (
			<div id="aligner">
				<div id="keypad-area">
					<div id="display-area">
						<Formula value={this.state.FOR} />
						<Display value={this.state.DIS} />
					</div>
					{this.makeKeys()}
				</div>
			</div>
		)
	}
};




class Display extends React.Component{
	render(){
		return (
			<div id="display">
				{this.props.value}
			</div>
		);
	}
};

class Formula extends React.Component{
	render(){
		return(
			<div id="formula">
				{this.props.value}
			</div>
		);
	}
};

ReactDOM.render(<Calculator />, document.getElementById("MyApp"));
    </div>
  );
}

export default App;
