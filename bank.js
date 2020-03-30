const readline = require("readline-sync");


let allUsers = [{
    userId: 10,
    user: 'Vexi',
    password: 'badpassword',
    balance: 2000,
    fund_requests: [{ from: 20, to: 10, sum: 450 }, { from: 25, to: 10, sum: 20 }, { from: 20, to: 10, sum: 20 },{ from: 20, to: 10, sum: 2000000 }]
  },
  {
    userId: 20,
    user: 'Vesku',
    password: 'badpassword',
    balance: 100,
    fund_requests: []
  },
  {
    userId: 25,
    user: 'Väsky',
    password: 'badpassword',
    balance: 500,
    fund_requests: [{ from: 20, to: 25, sum: 120 }]
  }];



const printHelp = function(){
    console.log(
    "$ Here’s a list of commands you can use! \n\
$ \n\
$ help                Opens this dialog.\n\
$ quit                Quits the program.\n\
$ \n\
$ Account actions\n\
$ create_account      Opens a dialog for creating an account.\n\
$ close_account       Opens a dialog for closing an account.\n\
$ change_name         Opens a dialog for changing the name associated with an account.\n\
$ does_account_exist  Opens a dialog for checking if an account exists.\n\
$ account_balance     Opens a dialog for logging in and prints the account balance.\n\
$ \n\
$ Fund actions\
$ withdraw_funds      Opens a dialog for withdrawing funds.\n\
$ deposit_funds       Opens a dialog for depositing funds.\n\
$ transfer_funds      Opens a dialog for transferring funds to another account.\n\
$ \n\
$ Fund requests\n\
$ request_funds       Opens a dialog for requesting another user for funds.\n\
$ fund_requests       Shows all the fund requests for the given account.\n\
$ accept_fund_request Opens a dialog for accepting a fund request.\n\
");
}
const printError = function(){
    console.log("Error. Invalid command");
}

const createAccount = function(){
    let userName, userPassword, initDeposit;
    console.log("\n$ Creating a new user account!\n\
$ Insert name");
    userName = readline.question(">");
    console.log("\n$ Good day to you "+userName+"\n\
$ How much is your initial deposit? (min 10e)");
    while(true){
        initDeposit = readline.questionInt(">");
        if(initDeposit >= 10){
            //ok
            console.log("\n$ Great, ",userName,"! You now have an account with a balance of",initDeposit,"€. \n\
$ We’re happy to have you as a customer, and we want to ensure that your money is safe with us. \n\
$ Give us a password, which gives only you the access to your account.\n")
            userPassword = readline.question(">");
            
            userAccount ={id: 2035, user: userName, password: userPassword, balance: initDeposit}
            // gather and create function
            constructAccount(userName,userPassword,initDeposit);
            break;
        }
        else if(initDeposit <10){
            console.log("$ Unfortunately we can’t open an account for such a small account. Do you have any more cash with you?")
        }
    }
}

const constructAccount = function(name, passwd, initdep){
    //check if account doesnt exist yet
    const userAccount ={userId: constructUserID(), user: name, password:passwd, balance: initdep, fund_requests: []}
    allUsers.push(userAccount);
    console.log("\n$ Your account is now created.\n$ Account id: ", userAccount.userId,"\n$ Store your account ID in a safe place.\n")
}
const constructUserID = function(){
    let ID =  Math.round(Math.random(1)*100); //min value 0.01 -> 1, max 1 -> 100
    console.log("ID: ",ID)
    for(let a = 0; a < allUsers.length;a++){
        if(allUsers[a].userId === ID){
            console.log("Duplicate ID: ", ID,". Rerolling");
            constructUserID();
        }
        // else: ok, next
    }
    console.log(ID);
    return ID;
}

const checkAccountExist = function(){
    console.log("$ Checking if an account exists!\n$ Enter the account ID whose existence you want to verify.")
    let checkID = readline.questionInt(">");

    if(getAccount(checkID))
    {
        console.log("\n$ This account exists.");
    }
    else{

        console.log("\n$ An account with that ID does not exist. Try again.")
    }
}

const getAccount = function(checkID){

    for(let i = 0; i < allUsers.length; i++){
        if(allUsers[i].userId === checkID){
            //console.log("\n$ This account exists: ",allUsers[i]);
            return allUsers[i];
        }
    }
    return false;
    
}

const validatePassword = function(userAccount, userPassword){
    if(userAccount.password === userPassword){
        return true;
    }
    else{
        return false;
    }
}

const checkBalance = function(){
    let inputUserId, inputPasswd, accountObj;
    let c = 1;
    console.log("\n$ Checking your account balance!\n$ What is your account ID?");
    while(true){
        inputUserId = readline.questionInt(">u:");
        if(getAccount(inputUserId)){
            console.log("\n$ Account found! Insert your password.");
            while(true){
                accountObj = getAccount(inputUserId);
                inputPasswd = readline.question(">p:");
                if(accountObj.password === inputPasswd){
                    // OK
                    console.log("\n$ Correct password. We validated you as",accountObj.user,".")
                    console.log("$ Your account balance is",accountObj.balance,".")
                    break;
                }
                else if(c === 3){
                    console.log("\n$ Wrong password too many times.")
                    break;
                }
                else{
                    c++
                    console.log("\n$ Wrong password, try typing it again.");
                }
            }
        }
        else{
            console.log("\n$ An account with that ID does not exist. Try again.");
        }
        break;
    }
}

const updateAccount = function (account, newName, newPassword){
    if(newName){
        account.user = newName;
    }
    if(newPassword){
        account.password = newPassword;
    }    
}

const changeName = function(){
    console.log("\n$ Changing the name associated with your account! \n\
$ What is your account ID?")
while(true){
    let inputUserId = readline.questionInt(">u:");
    if(getAccount(inputUserId)){
        console.log("\n$ Account found! Insert your password.");
        accountObj = getAccount(inputUserId);
        inputPasswd = readline.question(">p:");

        if(accountObj.password === inputPasswd){
            // OK
            console.log("\n$ Correct password. We validated you as",accountObj.user,".\n\
$ But it appears you want to change your name. \n\
$ Which name should we change your name to?");
            let newUserName = readline.question(">nu:")
            updateAccount(getAccount(inputUserId), newUserName)
            console.log("\n$ We will address you as ",getAccount(inputUserId).user," from now on.")
            break;
        }
        else{
            console.log("\n$ Wrong password, try typing it again.");
        }
    }
    else{
        console.log("\n$ An account with that ID does not exist. Try again.");
    }
}   
}

const modifyBalance = function (account, ammount, operation){
    switch(operation){
        case "DEC":
            account.balance = (account.balance - ammount);
            break;
        case "INC":
            account.balance = (account.balance + ammount);
            break;
        default:
            break;
    }
}
const withdrawFunds = function (){
    let c = 1;
    console.log("\n$ Withdrawing cash!\n$ What is your account ID?")
    while(true){    
        let userId = readline.questionInt(">u:");
    
        if(getAccount(userId)){
            console.log("\n$ Account found! Insert your password.");

            while(true){
                let userPassword = readline.question(">p:");
                if(validatePassword(getAccount(userId),userPassword)){
                    let currentBalance = getAccount(userId).balance
                    console.log("\n$ Correct password. We validated you as ",getAccount(userId).user,".")
                    while(true){
                        console.log("$ How much money do you want to withdraw? (Current balance: ",currentBalance,"€)")
                        let drawAmmount = readline.questionInt(">");
                        if( drawAmmount <= currentBalance){
                            modifyBalance(getAccount(userId), drawAmmount, "DEC");
                            console.log("$ Withdrawing a cash sum of ",drawAmmount,"€. Your account balance is now ",getAccount(userId).balance,"€.")
                            break;
                        }
                        else{
                            console.log("$ Unfortunately you don’t have the balance for that. Try a smaller amount.")
                        }
                    }
                    break;
                }
                else if(c === 3){
                    console.log("\n$ Wrong password too many times.")
                    break;
                }
                else{
                    //wrong password
                    c++;
                    console.log("\n$ Wrong password, try typing it again.")
                }
            }
        }
        else{
            console.log("\n$ An account with that ID does not exist. Try again.");
        }
        break;
    }
}

const depositFunds = function(){
    let c= 1;
    console.log("\n$ Depositing  cash!\n$ What is your account ID?")
    while(true){    
        let userId = readline.questionInt(">u:");
    
        if(getAccount(userId)){
            console.log("\n$ Account found! Insert your password.");
            while(true){
                let userPassword = readline.question(">p:");
                if(validatePassword(getAccount(userId),userPassword)){
                    let currentBalance = getAccount(userId).balance
                    console.log("\n$ Correct password. We validated you as ",getAccount(userId).user,".")
                    console.log("$ How much money do you want to deposit? (Current balance: ",currentBalance,"€)")
                    let sum = readline.questionInt(">");
                    modifyBalance(getAccount(userId), sum, "INC");
                    console.log("$ Depositing ",sum,"€. Your account balance is now ",getAccount(userId).balance,"€.")
                    break;
                }
                else if(c === 3){
                    console.log("\n$ Wrong password too many times.")
                    break;
                }
                else{
                    //wrong password
                    c++;
                    console.log("\n$ Wrong password, try typing it again.")
                }
            }
        }
        else{
            console.log("\n$ An account with that ID does not exist. Try again.");
        }
        break;
    }
}

const tranferFunds = function() {
    let outterC = 1;
    console.log("\n$ What is your account ID?")
    while(true){    
        let userId = readline.questionInt(">u:");
        if(getAccount(userId)){
            console.log("\n$ Account found! Insert your password.");
            while(true){
            let userPassword = readline.question(">p:");
                if(validatePassword(getAccount(userId),userPassword)){
                    let currentBalance = getAccount(userId).balance
                    console.log("\n$ Correct password. We validated you as ",getAccount(userId).user,".")
                    while(true){
                        console.log("$ How much money do you want to transfer? (Current balance: ",currentBalance,"€)")
                        let sum = readline.questionInt(">");
                        if( sum <= currentBalance){
                            console.log("$ Which account ID do you want to transfer these funds to?")
                            let innerCounter = 0;
                            while(true){
                                let targetID = readline.questionInt(">");
                                if(getAccount(targetID)){
                                    modifyBalance(getAccount(userId),sum, "DEC");
                                    modifyBalance(getAccount(targetID), sum, "INC");
                                    console.log("> Sending ",sum,"€ from account ID ",userId," to account ID ",targetID,".")
                                    break;
                                }
                                else if(innerCounter === 3){
                                    console.log("$ An account with that ID does REALLY NOT exist. Returning.");
                                    break;
                                }
                                else{
                                    innerCounter++
                                    console.log("$ An account with that ID does not exist. Try again.");
                                }
                            }
                            break;
                        }
                        else{
                            console.log("$ Unfortunately you don’t have the balance for that. Try a smaller amount.")
                        }
                        break;
                    }
                    // modifyBalance(getAccount(userId), sum, "INC");
                    // console.log("$ Depositing ",sum,"€. Your account balance is now ",getAccount(userId).balance,"€.")
                    break;
                }
                else if(outterC === 3){
                    console.log("\n$ Wrong password too many times.")
                    break;
                }
                else{
                    //wrong password
                    outterC++;
                    console.log("\n$ Wrong password, try typing it again.")
                }
            }
        }
        else{
            console.log("\n$ An account with that ID does not exist. Try again.");
        }
        break;
    }
}


// NEW STYLE!
// IMPLEMENT THIS TO ALL FUNCTIONS
const requestFunds = function(){
    console.log("$ Requesting funds!")
    const c = 1;
    const loginInfo = login();
    if(loginInfo[0]){
        // do stuff
        while(true){
            console.log("\n$ Which account ID do you request funds from?")
            let targetID = readline.questionInt(">");
            if(getAccount(targetID)){
                console.log("$ Account found. How much money do you want to request?")
                let requestSum = readline.questionInt(">sum:");
                console.log("$ Requesting ",requestSum,"€ from the user with ID ",targetID,".")
                newRequest(loginInfo[1],targetID,requestSum);
                break;
            }
            else if(c === 3){
                console.log("$ An account with that ID really DOES NOT exist. Returning.")
                break;

            }
            else{
                console.log("$ An account with that ID does not exist. Try again.")
            }
        }
    }
}

const newRequest = function(senderId, targetId, requestSum){
    getAccount(targetId).fund_requests.push({from:senderId, to:targetId, sum: requestSum})
}
// $ Listing fund requests!
// $ What is your account ID?
// > 2035
// $ Account found! Insert your password.
// > hunter12.
// $ Correct password. We validated you as Rene Orosz.
// $ Listing all the requests for your account!
// $  - 420€ for the user 69420.
// $  - 69€ for the user 69420.
// $  - 2.60€ for the user 90570.


const listRequests = function(id){
    let accountRequestInfo = getAccount(id).fund_requests;
    if(accountRequestInfo.length > 0){
        console.log("$ Listing all the requests for your account!")
        
        for(let c = 0; c < accountRequestInfo.length; c++){
            console.log("$ ",c+1,". ",accountRequestInfo[c].sum,"€ for the user: ",accountRequestInfo[c].from,".");
        }
        return true;
    }
    else{
        console.log("$ You dont seem to have any requests right now.")
        return false;
    }
}
const getRequestLength = function(id){
    return getAccount(id).fund_requests.length;

}

const fundRequests = function(){
    console.log("$ Listing fund requests!");
    const loginInfo = login();
    if(loginInfo[0]){
        listRequests(loginInfo[1]);
    }
}

const acceptFundRequests = function(){
    console.log("$ Accepting fund requests!");
    const loginInfo = login();
    if(loginInfo[0]){
        let id = loginInfo[1];

        if(getRequestLength(loginInfo[1]) >0){
            while(true){
                console.log("\n$ Your account balance is ",getAccount(id).balance,"€. Which fund request would you like to accept?")
                listRequests(loginInfo[1]);
                let targetRequest = (readline.questionInt(">"))-1;
                if(typeof(targetRequest) === 'number'){

                    let getRequestFromArray = getAccount(id).fund_requests[targetRequest]  //target request
                    let sum = getRequestFromArray.sum;  // requests sum
                    let sender = getRequestFromArray.from;
                    let currentBalance = getAccount(id).balance;
                    console.log("\n$ Accepting fund request ",sum,"€ for the user ",sender,".")
                    if(sum <= currentBalance){
                        modifyBalance(getAccount(id),sum, "DEC");
                        modifyBalance(getAccount(sender), sum, "INC");
                        console.log("$ Transferring  ",sum,"€ to account ID  ",sender,".\n$ Your account balance is now  ",getAccount(id).balance,"€.")
                        //const targetToBeDeleted = getAccount(id).fund_requests[targetRequest];
                        getAccount(id).fund_requests.splice(targetRequest, 1)
                        break;
                    }
                    else{
                        console.log("\n$ You do not have funds to accept this request.")
                    }
                    
                }
                else{
                    console.log("\n$ Please give a index number.")
                }
            }
        }
        else{
            console.log("\n$ You dont seem to have any requests right now.")
        }
    }
}

const login = function(){
    console.log("\n$ What is your account ID?")
    let outterC = 1;
    while(true){    
        let userId = readline.questionInt(">u:");
        if(getAccount(userId)){
            console.log("\n$ Account found! Insert your password.");
            while(true){
            let userPassword = readline.question(">p:");
                if(validatePassword(getAccount(userId),userPassword)){
                    console.log("\n$ Correct password. We validated you as ",getAccount(userId).user,".")
                    return validation = [true, userId];
                }
                else if(outterC === 3){
                    console.log("\n$ Wrong password too many times.")
                    break;
                }
                else{
                    //wrong password
                    outterC++;
                    console.log("\n$ Wrong password, try typing it again.")
                }
            }
        }
        else{
            console.log("\n$ An account with that ID does not exist. Try again.");
        }
        break;
    }
    return [false, ];
}

const main = function (){
    console.log("Welcome to Buutti banking CLI! \
    \nHint: You can get help with the commands by typing 'help'.\n");
    while(true){
        //console.log("Debug: ",getAccount(10).fund_requests[0])

        let cmd = readline.question(">");
        switch(cmd){

            case 'help':
                printHelp();
                break;

            case 'quit':
                console.log("Quiting the program. Bye bye!");
                return process.exit(22);
            case 'create_account':
                createAccount();
                break;
            case 'close_account':
                console.log("Not yet implemented");
                break;
            case 'change_name':
                changeName();
                break;
            case 'does_account_exist':
                checkAccountExist();
                break;
            case 'account_balance':
                checkBalance();
                break;
            case 'withdraw_funds':
                withdrawFunds()
                break;
            case 'deposit_funds':
                depositFunds();
                break;
            case 'transfer_funds':
                tranferFunds();
                break;
            case 'request_funds':
                requestFunds();
                break;
            case 'fund_requests':
                fundRequests();
                break;
            case 'accept_fund_request':
                acceptFundRequests();
                break;
            default:
                printError();
    }
    
    }
}

main();