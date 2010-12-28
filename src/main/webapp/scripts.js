function doLogin() {
	var request = new XMLHttpRequest();
	var txtUserName = document.getElementById("userName");
	var txtPassword = document.getElementById("password");
	var userName = txtUserName.value;
	var password = txtPassword.value;
	txtUserName.value = "";
	txtPassword.value = "";

	request.open("POST","library/login.jsp?userName=" + userName + "&password=" + password, true);
	request.onreadystatechange = function() {
		if(request.readyState == 4 ) {
			if(request.status == 200) {
				var response = request.responseText;
				if(response == "valid") {
					location.assign("dashboard.jsp");
				} else {
					alert("Login Error! \n" + response);
				}
			} else {
				alert("Login Error!" + request.status);
			}
		}
	};
	request.send(null);
}

function doInstall() {
	var databaseName = null;
    if (document.getElementById("mysql").selected == 1) {
        databaseName = document.getElementById("DBName").value;
    }
	var databaseUserName = document.getElementById("DBUserName").value;
	var databasePassword = document.getElementById("DBPassword").value;
	var pass1 =  document.getElementById("adminPassword").value;
	var pass2 =  document.getElementById("adminPassword2").value;
    var type = document.getElementById("mysql").selected;
	if(pass1 != pass2) {
		alert("Passwords do not match!");
		return;
	}
	if(pass1 == null || pass1 == "") {
		alert("Passwords must have a value!");
		return;
	}

	var request = new XMLHttpRequest();
	var url = "installDatabase.jsp";
    var parameters;
    if (databaseName != null) {
        parameters = "dbName=" + databaseName + "&dbUserName=" + databaseUserName + "&dbPassword=" + databasePassword + "&password=" + pass1 + "&type=" + type;
    } else {
        parameters = "dbUserName=" + databaseUserName + "&dbPassword=" + databasePassword + "&password=" + pass1 + "&type="+type;
    }
	request.open("POST", url, true);

	//Send the proper header information along with the request
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.setRequestHeader("Content-length", parameters.length);
	request.setRequestHeader("Connection", "close");

	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			if(request.status == 200) {
			document.body.style.cursor = "default";
				if(request.responseText == "success") {
					window.location = "../index.jsp";
				} else {
					window.location = "failure.jsp?error=" + request.responseText;
				}
			} else {
				alert("Install has failed. Please delete the MySQL database tables and try again.\n" + request.responseText);
				document.body.style.cursor = "default";
			}
		} else {
			document.body.style.cursor = "wait";
		}
	};
	request.send(parameters);
}

function showLDAP() {
	var div = document.getElementById("LDAPAuthentication");
	var checkbox = document.getElementById("LDAPCheck");
	if(checkbox.checked == 1) {
		div.innerHTML = "Some ldap needed stuff here!";
	} else {
		div.innerHTML = "";
	}
}

function checkPassword() {
	var pass1 =  document.getElementById("adminPassword").value;
	var pass2 =  document.getElementById("adminPassword2").value;
	var verification = document.getElementById("passwordVerification");
	if(pass1 == pass2 && pass1.length > 0) {
		verification.innerHTML = "Passwords match";
		verification.style["color"] = "green";
	} else {
		verification.innerHTML = "Passwords don't match";
		verification.style["color"]= "red";
	}

}

function changePassword(id) {
	var element = document.getElementById("changePassword");
    var elementButton = document.getElementById("changePWButton");
    if(element.innerHTML == "") {
        element.innerHTML = "<button onclick='changePassword(null)'>Cancel</button><br /><input type='password' id='pass1'><br /><input type='password' id='pass2'>";
        elementButton.innerHTML = "Submit Password";
	} else {
        if(id != null) {
            if(doPasswordChange(id)) {
                elementButton.innerHTML = "Change Password";
                element.innerHTML = "";
            } else {
                alert("Unable to change Password");
            }
        } else {
            element.innerHTML = "";
        }
    }
}

function doPasswordChange(id) {
    var pass1 =  document.getElementById("pass1").value;
	var pass2 =  document.getElementById("pass2").value;
	if(pass1 != pass2) {
		alert("Passwords do not match!");
		return;
	}
	if(pass1 == null || pass1 == "") {
		alert("Passwords must have a value!");
		return;
	}

    var request = new XMLHttpRequest();
	var url = "library/changePW.php";
	var parameters = "password=" + pass1 + "&id=" + id;
	request.open("POST", url, true);

	//Send the proper header information along with the request
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.setRequestHeader("Content-length", parameters.length);
	request.setRequestHeader("Connection", "close");

	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			if(request.status == 200) {
			document.body.style.cursor = "default";
				if(request.responseText != "success") {
					alert("Unable to change password.");
				}
			} else {
				alert("Unable to change password.");
				document.body.style.cursor = "default";
			}
		} else {
			document.body.style.cursor = "wait";
		}
	};
	request.send(parameters);

}

function calculateTime() {
    var start = document.getElementById("startTime").value;
	var end = document.getElementById("endTime").value;
	var lunch = document.getElementById("lunchTime").value;
	var startArray = start.split(":");
	var endArray = end.split(":");
    var lunchArray = lunch.split(":");
    if(startArray.length != 2 || endArray.length != 2 || lunchArray.length != 2) {
        alert("Input is incorrect!");
        return;
    }
    var lunchHours = Math.round((parseFloat(lunchArray[0] == "" ? "0" : lunchArray[0]) + parseFloat(lunchArray[1] == "" ? "0" : lunchArray[1])/60)*100) /100;

    var startHours = Math.round((parseFloat(startArray[0] == "" ? "0" : startArray[0]) + parseFloat(startArray[1] == "" ? "0" : startArray[1])/60)*100) /100;
	if(document.getElementById("startPM").checked) {
		startHours += 12;
	}
    var endHours = Math.round((parseFloat(endArray[0] == "" ? "0" : endArray[0]) + parseFloat(endArray[1] == "" ? "0" : endArray[1])/60)*100) /100;
	if(document.getElementById("endPM").checked) {
		endHours += 12;
	}

	document.getElementById("hours").value = Math.round((endHours - startHours - lunchHours)*100)/100;
	document.getElementById("startTime").value = "";
	document.getElementById("endTime").value = "";
	document.getElementById("lunchTime").value = "";
}

function doTimePeriodGeneration() {
    var date = document.getElementById("date").value;
    var request = new XMLHttpRequest();
	var url = "library/getEmployeesForTimePeriod.php";
	var parameters = "date=" + date;
	request.open("POST", url, true);

	//Send the proper header information along with the request
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.setRequestHeader("Content-length", parameters.length);
	request.setRequestHeader("Connection", "close");

	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			if(request.status == 200) {
			    document.body.style.cursor = "default";
			    document.getElementById("employees").innerHTML = request.responseText;
			} else {
				alert("Unable to change password.");
				document.body.style.cursor = "default";
			}
		} else {
			document.body.style.cursor = "wait";
		}
	};
	request.send(parameters);
}

function getCalendarForEmployee() {
    var url = "library/ajaxGetTimePeriodCalendar.php";
    var parameters = "empID=" + document.getElementById("employeeID").value;
    var date = document.getElementById("fullDate").value;
    if(date != "") {
        parameters += "&date=" + date;
    }
    var request = new XMLHttpRequest();
	request.open("POST", url, true);

	//Send the proper header information along with the request
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.setRequestHeader("Content-length", parameters.length);
	request.setRequestHeader("Connection", "close");

	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			if(request.status == 200) {
			    document.body.style.cursor = "default";
			    document.getElementById("calendar").innerHTML = request.responseText;
			} else {
				alert("Unable to change password.");
				document.body.style.cursor = "default";
			}
		} else {
			document.body.style.cursor = "wait";
		}
	};
	request.send(parameters);
}

function approveTime(id, all) {
    if(!all) {
        document.location = "library/saveApproval.php?id=" + id + "&manager=false"
    } else {
        document.location = "library/saveApproval.php?empid=" + id + "&manager=false"
    }

}

function hideName() {
    var dbNameText = "<label for='DBName'>Database Name:</label> <input class = 'field' type = 'text' id = 'DBName' name = 'DBName' /> <br/>";
    if (document.getElementById("mysql").checked == 1) {
        document.getElementById("mySqlChoice").innerHTML = dbNameText;
    } else {
        document.getElementById("mySqlChoice").innerHTML = "";
    }
}