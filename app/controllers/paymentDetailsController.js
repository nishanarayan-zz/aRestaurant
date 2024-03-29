(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* browserify added code above > browserify paymentDetailsController.js -o output.js, for adding module 'braintree-web' */
	
first_app.controller('paymentDetailsController' , function($scope, $http, $uibModal, $location,removeCard,$rootScope,$route,$cookies,hideContainer ){
	
	var braintree = require('braintree-web');
	$scope.sameAsBillingChecked = false ; 
	$scope.sameAsBillingDisabled = false ;
	$scope.billingAddressDisabled = false ;
	$scope.hidePymtContainer = true;
	$scope.cardFieldsDisabled = false ;
	$scope.hideCardFieldContainer = true;
	$scope.storedPayment = false ;
    $scope.modalValidationText = "";
	$scope.storedCards = [{'Name' : 'Stored Payment Methods'}];
	$scope.storeCard = false ;
	var states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','AS','DC','FM','GU','MH','MP','PW','PR','VI'];
	
	var client ;
	var clientToken;
		
	$scope.customerPaymentInfo = {
			customerId: '',
			customerName: '',
			paymentMethod: 'Card',
			deliveryAddress : {
					shipAddressLine1: '',
					shipAddressLine2:'',
					shipCity:'',
					shipState:'',
					shipZipCode:'' 
				    },
			customerEmail:'',
			customerPhone:''
	}
	
	
	var getCashOrderId = function() {
		var chars = '01234abcdefghijklmnopqrstuvwxyz56789' ;
	    var result = '';
	    for (var i = 8; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
	    return result;
	}
	
	
	$scope.disableCardFields = function() {
		$scope.hideCardFieldContainer = false;
		$scope.billAddressBackgroundColor = {
				'background-color':'#b3b3b3'
		}
		$scope.billingAddressDisabled = true ;
		$scope.sameAsBillingChecked = false;
		$scope.shipAddressBackgroundColor = {
				'background-color':'#f2f2f2'
		}
		$scope.sameAsBillingDisabled = true ;
		$scope.cardFieldsDisabled = true ;
		$scope.cardFieldBackgroundColor = {
			'background-color':'#a6a6a6'
		}
		$scope.storedMethodDisabled = true ;
		$scope.storedMethodBackgroundColor = {
		    'background-color':'#a6a6a6'	
		}
		$scope.disableStoreCard = true ;
		$scope.storeCardStyle = {
				   'color':'#595959'
		}
		$scope.customerCardNum = "" ;
		$scope.selectedCard = $scope.storedCards[0].Name ;
		$scope.showRemoveCardIcon = false ;
	}
	
	$scope.enableCardFields = function() {
		$scope.hideCardFieldContainer = true ;
		$scope.billAddressBackgroundColor = {
				'background-color':'#f2f2f2'
		}
		$scope.sameAsBillingDisabled = false ;
		$scope.billingAddressDisabled = false ; 
		$scope.cardFieldsDisabled = false ;
		$scope.storedMethodDisabled = false;
		$scope.cardFieldBackgroundColor = {
				'background-color':'lightgrey'	
		}
		$scope.storedMethodBackgroundColor = {
			    'background-color':'lightgrey'	
		}
		$scope.enableStoreCard();
	}
  
	$scope.enableStoreCard = function() {
		   $scope.disableStoreCard = false ; 
		   $scope.storeCardStyle = {
				   'color':'#452440'
		   }
	}
		
	$scope.disableShippingAddress = function(sameAsBillingIsChecked) {
		if(sameAsBillingIsChecked){
			$scope.shipAddressBackgroundColor = {
					'background-color':'#a6a6a6'
			}
			$scope.customerPaymentInfo.deliveryAddress.shipAddressLine1 = $scope.billAddressLine1 ;
			$scope.customerPaymentInfo.deliveryAddress.shipAddressLine2 = $scope.billAddressLine2 ;
			$scope.customerPaymentInfo.deliveryAddress.shipCity = $scope.billCity ;
			$scope.customerPaymentInfo.deliveryAddress.shipState = $scope.billState ;
			$scope.customerPaymentInfo.deliveryAddress.shipZipCode = $scope.billZipCode ;	
		}
		else {
			$scope.shipAddressBackgroundColor = {
					'background-color':'#f2f2f2'
			}   
			$scope.customerPaymentInfo.deliveryAddress.shipAddressLine1 = "" ;
			$scope.customerPaymentInfo.deliveryAddress.shipAddressLine2 = "" ;
			$scope.customerPaymentInfo.deliveryAddress.shipCity = "" ;
			$scope.customerPaymentInfo.deliveryAddress.shipState = "" ;
			$scope.customerPaymentInfo.deliveryAddress.shipZipCode = "" ;
		}
	}
	
	$scope.isCardSelected = function() {
		if ($scope.selectedCard != $scope.storedCards[0].Name){
			$scope.showRemoveCardIcon = true ;
			$scope.cardFieldsDisabled = true ;
			$scope.cardFieldBackgroundColor = {
				'background-color':'#a6a6a6'
			}
			
			$scope.disableStoreCard = true ;
			$scope.storeCardStyle = {
					   'color':'#595959'
			}
			$scope.hideCardFieldContainer = false ;
			$scope.sameAsBillingDisabled = true ;
			$scope.billingAddressDisabled = true ;
			$scope.billAddressBackgroundColor = {
					'background-color':'#a6a6a6'
			}
			$scope.storedPayment = true ;
		}
		else {
			$scope.showRemoveCardIcon = false ;
			$scope.cardFieldsDisabled = false ;
			$scope.cardFieldBackgroundColor = {
				'background-color':'lightgrey'	
			}
			$scope.hideCardFieldContainer = true ;
			$scope.sameAsBillingDisabled = false ;
			$scope.billingAddressDisabled = false ;
			$scope.billAddressBackgroundColor = {
					'background-color':'#f2f2f2'
			}
			$scope.enableStoreCard();
			$scope.storedPayment = false ;	
		}
	}
	
	$scope.removeCard = function(selectedCard){
		$scope.hidePymtContainer = false ;
		$scope.modalValidationText = "Are you sure you want to delete this stored payment method?"
		$uibModal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'cardRemoveConfirmation.html',
		      controller: 'cardRemoveModalInstanceCtrl',
		      resolve: {
		    	  validationText : function () {
		    		  return $scope.modalValidationText ;
		    	  }
		      }
	   });
	}
	
	$scope.$on('removeCardConfirmed', function() {
		
		var tokenToRemove  = $scope.storedCards.filter(function (obj) {
			return obj.Name  == $scope.selectedCard; 
		})[0].Token;
		
		$scope.pymtMethodToRemove = {
				'Token' : tokenToRemove
		}
		
		$http.post('/deleteStoredPymt', JSON.stringify($scope.pymtMethodToRemove)).then(
				function(response){
					if(response.data == "Success"){	
						deletePaymentMethod();
					}
					else if(response.data == "401"){
						sessionStorage.setItem("sessionExpiredPage" , $location.path());
						sessionStorage.setItem("401", 'true');
						sessionStorage.removeItem("signedInCustomer");
						$location.path('/sessionExpired');
					}
					else if(response.data == "Not Found"){
						/* payment method not found in vault but present in database */
						deletePaymentMethod();	
					}
					else {
						$scope.hidePymtContainer = false ;
						$scope.modalValidationText = "An error occurred. Please try again."
							$uibModal.open({
							      animation: $scope.animationsEnabled,
							      templateUrl: 'modalValidation.html',
							      controller: 'ModalInstanceCtrl',
							      resolve: {
							    	  validationText : function () {
							    		  return $scope.modalValidationText ;
							    	  }
							      }
					    });
					}
				},
				function(response){
					/* payment method not deleted from vault and database */
					$scope.hidePymtContainer = false ;
					$scope.modalValidationText = "A server error occurred. Please try again."
							$uibModal.open({
							      animation: $scope.animationsEnabled,
							      templateUrl: 'modalValidation.html',
							      controller: 'ModalInstanceCtrl',
							      resolve: {
							    	  validationText : function () {
							    		  return $scope.modalValidationText ;
							    	  }
							      }
					});
				}
		);
	
	}); 
	
	
	var deletePaymentMethod = function(){
		
		$http.post('/deletePaymentMethod', JSON.stringify($scope.pymtMethodToRemove)).then(
				function(response){
					if(response.data == "Success"){
						var removeIndex = $scope.storedCards.length ;
						while(removeIndex--){
							if($scope.storedCards[removeIndex].Token === $scope.pymtMethodToRemove.Token)break;
						}
						$scope.storedCards.splice(removeIndex,1);
						$scope.selectedCard = $scope.storedCards[0].Name;
						$scope.showRemoveCardIcon = false ;
						$scope.enableCardFields(); 
					}
					else if (response.data == "401"){
						sessionStorage.setItem("sessionExpiredPage" , $location.path());
						sessionStorage.setItem("401", 'true');
						sessionStorage.removeItem("signedInCustomer");
						$location.path('/sessionExpired');
					}
					else {
						/* payment method deleted from vault but not from database */
						$scope.hidePymtContainer = false ;
						$scope.modalValidationText = "An error occurred. Please try again."
  							$uibModal.open({
  							      animation: $scope.animationsEnabled,
  							      templateUrl: 'modalValidation.html',
  							      controller: 'ModalInstanceCtrl',
  							      resolve: {
  							    	  validationText : function () {
  							    		  return $scope.modalValidationText ;
  							    	  }
  							      }
  						  });
					}
				},
				function(response){
					/* payment method deleted from vault but not from database */
					$scope.hidePymtContainer = false ;
					$scope.modalValidationText = "A server error occurred. Please try again."
							$uibModal.open({
							      animation: $scope.animationsEnabled,
							      templateUrl: 'modalValidation.html',
							      controller: 'ModalInstanceCtrl',
							      resolve: {
							    	  validationText : function () {
							    		  return $scope.modalValidationText ;
							    	  }
							      }
						  });
				}
		);
	}
	
	$scope.$on('hideContainer', function() {
		$scope.hidePymtContainer = true ;
		$scope.showLoadingIcon = false;
	}); 
	

	
   $scope.placeOrder = function () {
	   sessionStorage.removeItem("confirmEmailSent");
	   $scope.showLoadingIcon = true ;
	   if(sessionStorage.getItem("signedInCustomer") != null){
		   $scope.storedCustomerDetails.BTreeCustId = JSON.parse(sessionStorage.getItem("signedInCustomer")).BTreeCustId;
	   }
	   else {
		   $location.path('/signIn');
	   }
	   if($scope.customerPaymentInfo.paymentMethod == "Cash"){
		   placeCashOrder();
	   } // if card payment
	   else {
           placeCardOrder();
	   }
   }
   
    var updateBTreeCustId = function(BTreeCustId) {
       $scope.storedCustomerDetails.BTreeCustId = BTreeCustId;
	   var BTreeCustomer = {
				 '_id'         :$scope.customerPaymentInfo.customerId, 
	             'BTreeCustId' :BTreeCustId
				  }
	   
       $http.post('/updateBTreeCustId',JSON.stringify(BTreeCustomer)).then(
 		 function(response){
 			 if(response.data != 'Failed'){
 				 if(response.data == "401"){
						sessionStorage.setItem("sessionExpiredPage" , $location.path());
						sessionStorage.setItem("401", 'true');
						sessionStorage.removeItem("signedInCustomer");
						$location.path('/sessionExpired');  
 				 }
 				 else {
    			 /* broadcasting inputSubmitRequest event for hosted fields instance */
    		     $scope.$broadcast('inputSubmitRequest'); 
 				 }
 			 }
 			 else {
 				$scope.hidePymtContainer = false ;
 				$scope.modalValidationText = "An error occurred . Please try again."
						$uibModal.open({
						      animation: $scope.animationsEnabled,
						      templateUrl: 'modalValidation.html',
						      controller: 'ModalInstanceCtrl',
						      resolve: {
						    	  validationText : function () {
						    		  return $scope.modalValidationText ;
						    	  }
						      }
					  });
 			 }
		 },
		 function(response){
			 $scope.hidePymtContainer = false ;
			 $scope.modalValidationText = "A server error occurred . Please try again."
					$uibModal.open({
					      animation: $scope.animationsEnabled,
					      templateUrl: 'modalValidation.html',
					      controller: 'ModalInstanceCtrl',
					      resolve: {
					    	  validationText : function () {
					    		  return $scope.modalValidationText ;
					    	  }
					      }
				  });
		 }		 
       );	 
   }
   
   var placeCashOrder = function() {
	   var modalValidationFlag = false;
	   if($scope.billingFirstName == "" || $scope.billingFirstName == undefined){
		   $scope.modalValidationText = "You must enter your First name to proceed."
		   modalValidationFlag = true;
	   }
	   else if($scope.billingLastName == "" || $scope.billingLastName == undefined){
		   $scope.modalValidationText = "You must enter your Last name to proceed."
		   modalValidationFlag = true;
	   }
	   else if (($scope.customerPaymentInfo.deliveryAddress.shipAddressLine1 == undefined || $scope.customerPaymentInfo.deliveryAddress.shipAddressLine1 == "") ||
	   ($scope.customerPaymentInfo.deliveryAddress.shipCity == undefined || $scope.customerPaymentInfo.deliveryAddress.shipCity == "") ||
	   ($scope.customerPaymentInfo.deliveryAddress.shipZipCode == undefined || $scope.customerPaymentInfo.deliveryAddress.shipZipCode == "")||
	   ($scope.customerPaymentInfo.deliveryAddress.shipState == undefined || $scope.customerPaymentInfo.deliveryAddress.shipState == "")){
		   $scope.modalValidationText = "You must enter mandatory fields for shipping Address."  
		   modalValidationFlag = true;
	   }  
	   else if ($scope.customerPaymentInfo.customerEmail == "" || $scope.customerPaymentInfo.customerEmail == undefined){
		   $scope.modalValidationText = "You must enter a valid e-mail address." 
		   modalValidationFlag = true;
	   }
	   else if ($scope.customerPaymentInfo.customerPhone == "" || $scope.customerPaymentInfo.customerPhone == undefined) {
		   $scope.modalValidationText = "You must enter a valid phone number." 
		   modalValidationFlag = true;
	   }
	   else if (states.indexOf($scope.customerPaymentInfo.deliveryAddress.shipState) == -1) {
		   $scope.modalValidationText = "You must enter a valid state." 
		   modalValidationFlag = true;
	   }
	   if( modalValidationFlag == true){
		   $scope.hidePymtContainer = false ;
		   $uibModal.open({
			      animation: $scope.animationsEnabled,
			      templateUrl: 'modalValidation.html',
			      controller: 'ModalInstanceCtrl',
			      resolve: {
			    	  validationText : function () {
			    		  return $scope.modalValidationText ;
			    	  }
			      }
		   });
	   }
	   else {
		   $scope.customerPaymentInfo.customerName = $scope.billingFirstName ;
		   $scope.orderDetails.OrderId =  getCashOrderId() ;	
		   addOrder();  
	   }
   }
   
   var placeCardOrder = function() {
	   var modalValidationFlag = false;
	   if($scope.billingFirstName == "" || $scope.billingFirstName == undefined ){
		   $scope.modalValidationText = "You must enter your full name as it appears on your card."
		   modalValidationFlag = true;
	   }
	   else if($scope.billingLastName == "" || $scope.billingLastName == undefined ){
		   $scope.modalValidationText = "You must enter your full name as it appears on your card."
		   modalValidationFlag = true;
	   }
	   else if ($scope.storedPayment == false && (
			    ($scope.billAddressLine1 == undefined || $scope.billAddressLine1 == "") ||
			    ($scope.billCity == undefined || $scope.billCity == "") ||
			    ($scope.billZipCode == undefined || $scope.billZipCode == "")||
			    ($scope.billState == undefined || $scope.billState == "")) ){
		   $scope.modalValidationText = "You must enter mandatory fields for Billing Address."  
		   modalValidationFlag = true;
	   }  
	   else if ($scope.sameAsBillingChecked == false && (
			   ($scope.customerPaymentInfo.deliveryAddress.shipAddressLine1 == undefined || $scope.customerPaymentInfo.deliveryAddress.shipAddressLine1 == "") ||
			   ($scope.customerPaymentInfo.deliveryAddress.shipCity == undefined || $scope.customerPaymentInfo.deliveryAddress.shipCity == "") ||
			   ($scope.customerPaymentInfo.deliveryAddress.shipZipCode == undefined || $scope.customerPaymentInfo.deliveryAddress.shipZipCode == "")||
			   ($scope.customerPaymentInfo.deliveryAddress.shipState == undefined || $scope.customerPaymentInfo.deliveryAddress.shipState == "")
	           )) {
		   $scope.modalValidationText = "You must enter mandatory fields for Shipping Address." 
		   modalValidationFlag = true;
	   }  
	   else if ($scope.customerPaymentInfo.customerEmail == "" || $scope.customerPaymentInfo.customerEmail == undefined){
		   $scope.modalValidationText = "You must enter a valid e-mail address." 
		   modalValidationFlag = true;
	   }
	   else if ($scope.customerPaymentInfo.customerPhone == "" || $scope.customerPaymentInfo.customerPhone == undefined) {
		   $scope.modalValidationText = "You must enter a valid phone number." 
		   modalValidationFlag = true;
	   }
	   else if ($scope.sameAsBillingChecked == false && states.indexOf($scope.customerPaymentInfo.deliveryAddress.shipState) == -1) {
		   $scope.modalValidationText = "You must enter a valid state." 
		   modalValidationFlag = true;
	   }
	   else if ($scope.storedPayment == false && states.indexOf($scope.billState) == -1 ){
		   $scope.modalValidationText = "You must enter a valid state."  
		   modalValidationFlag = true;
	   } 
   if( modalValidationFlag == true){
	   $scope.hidePymtContainer = false ;
	   $uibModal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'modalValidation.html',
		      controller: 'ModalInstanceCtrl',
		      resolve: {
		    	  validationText : function () {
		    		  return $scope.modalValidationText ;
		    	  }
		      }
	   });
   }
   else {
	   if($scope.sameAsBillingChecked){ 
		   $scope.customerPaymentInfo.customerName = $scope.billingFirstName ;
		   $scope.customerPaymentInfo.deliveryAddress.shipAddressLine1 = $scope.billAddressLine1 ;
		   $scope.customerPaymentInfo.deliveryAddress.shipAddressLine2 = $scope.billAddressLine2 ;
		   $scope.customerPaymentInfo.deliveryAddress.shipCity = $scope.billCity ;
		   $scope.customerPaymentInfo.deliveryAddress.shipState = $scope.billState ;
		   $scope.customerPaymentInfo.deliveryAddress.shipZipCode = $scope.billZipCode ; 
	   }
	   /* In case transaction was completed, but payment method was not stored in the database */
	   if(!sessionStorage.getItem('TxnCompleted')) { 
	   if($scope.storedCustomerDetails.BTreeCustId == "" ){  
    	   /* create BTree customer if it is the first transaction made by a customer. */
    	   var BTreeCustomer = {
    			   'FirstName' :$scope.billingFirstName,
    			   'LastName'  :$scope.billingLastName,
    			   'Email'     :$scope.customerPaymentInfo.customerEmail,
    			   'Phone'     :$scope.customerPaymentInfo.customerPhone
    	   }
    	   
    	   $http.post('/createBTreeCustomer', JSON.stringify(BTreeCustomer)).then(
    			 function(response) {
    				 if(response.data != 'Failed'){
    					     if(response.data == "401"){
    								sessionStorage.setItem("sessionExpiredPage" , $location.path());
    								sessionStorage.setItem("401", 'true');
    								sessionStorage.removeItem("signedInCustomer");
    								$location.path('/sessionExpired'); 
    					     }
    					     else {
	        				 /* Refreshing session storage for signed-in customer */
        					 $scope.storedCustomerDetails.BTreeCustId = response.data ;
        					 sessionStorage.setItem("signedInCustomer", JSON.stringify($scope.storedCustomerDetails));
	        				 updateBTreeCustId($scope.storedCustomerDetails.BTreeCustId); 
    					     }
    				 }
    				 else {
    					 $scope.hidePymtContainer = false ;
    					 $scope.modalValidationText = "An error occurred . Please try again."
  							$uibModal.open({
  							      animation: $scope.animationsEnabled,
  							      templateUrl: 'modalValidation.html',
  							      controller: 'ModalInstanceCtrl',
  							      resolve: {
  							    	  validationText : function () {
  							    		  return $scope.modalValidationText ;
  							    	  }
  							      }
  						  });
    				 }
    			 },
    			 function(response) {
    				 $scope.hidePymtContainer = false ;
    				 $scope.modalValidationText = "A server error occurred . Please try again."
							$uibModal.open({
							      animation: $scope.animationsEnabled,
							      templateUrl: 'modalValidation.html',
							      controller: 'ModalInstanceCtrl',
							      resolve: {
							    	  validationText : function () {
							    		  return $scope.modalValidationText ;
							    	  }
							      }
						  });
    			 }
    	     );
       } 
	   else {
		   /* If customer wants to use an existing payment method */
		   if($scope.selectedCard != $scope.storedCards[0].Name){ 
			  $scope.pymtMethodToken = $scope.storedCards.filter(function (obj) {
					return obj.Name  === $scope.selectedCard; 
				})[0].Token; // Gives the first occurrence, for two payment methods with same last 4. 
			 /* Broadcasting  'storedPymtSubmitRequest' event for utilizing a stored
			  * payment method for the purchase */
			  $scope.$broadcast('storedPymtSubmitRequest') ;
		   }
		   else {
		   /* Broadcasting inputSubmitRequest event for hosted fields instance,
		    * for customers who have existing BTree customer Id.  */
		      $scope.$broadcast('inputSubmitRequest'); 
		   }
	   }
	  }
	   else {
		   /* Transaction was completed, but payment method was not stored in the database */
		   var transaction = JSON.parse(sessionStorage.getItem('TxnCompleted'));
		   addCardOrder(transaction.TransactionId,transaction.Last4,transaction.PymtMethodToken);
	   }
   }
   }
   var onload = function () {
	    $http.get('/client_token').then(
			    function(response){
			    	if(response.data != 'Failed'){	
			    		if(response.data != "401"){
			    		 braintree.client.create({
			    		      authorization:response.data
			    		    }, function (clientErr, clientInstance) {
			    		      if (clientErr) { /* Client instance is not created */
			    		    	  $scope.hidePymtContainer = false ;
			    		    	  $scope.modalValidationText = "An error occurred. Please re-load the page."
			  						$uibModal.open({
			  						      animation: $scope.animationsEnabled,
			  						      templateUrl: 'modalValidation.html',
			  						      controller: 'ModalInstanceCtrl',
			  						      resolve: {
			  						    	  validationText : function () {
			  						    		  return $scope.modalValidationText ;
			  						    	  }
			  						      }
			  					  });
			    		        return;
			    		      }
			    		      braintree.hostedFields.create({
			    		        client: clientInstance,
			     		        styles: {
			    		            'input': {
			    		              'font-size': '14px'
			    		            },
			    		            'input.invalid': {
			    		              'color': 'red'
			    		            },
			    		            'input.valid': {
			    		              'color': 'green'
			    		            }
			    		         },
			    		        fields: {
			    		          number: {
			    		            selector: '#card-number',
			    		            placeholder: '4111 1111 1111 1111'
			    		          },
			    		          cvv: {
			    		            selector: '#cvv',
			    		            placeholder: '123'
			    		          },
			    		          expirationDate: {
			    		            selector: '#expiration-date',
			    		            placeholder: '10/2019'
			    		          }
			    		        }
			    		      }, function (hostedFieldsErr, hostedFieldsInstance) {
			    		        if (hostedFieldsErr) { /* Hosted fields instance is not created */
			    		        	$scope.hidePymtContainer = false ;
			    		        	$scope.modalValidationText = "An error occurred. Please re-load the page."
										$uibModal.open({
										      animation: $scope.animationsEnabled,
										      templateUrl: 'modalValidation.html',
										      controller: 'ModalInstanceCtrl',
										      resolve: {
										    	  validationText : function () {
										    		  return $scope.modalValidationText ;
										    	  }
										      }
									  });
			    		          return;
			    		        }
			    		        
			    		        $scope.$on('inputSubmitRequest', function () {
			    		        	 hostedFieldsInstance.tokenize(function (tokenizeErr, payload) {
					    		            if (tokenizeErr) { /* credit card information was not tokenized */
					    		            	$scope.hidePymtContainer = false ;
					    		            	 $scope.modalValidationText = "An error occurred. Please verify billing information and try again."
					    							  $uibModal.open({
					    							      animation: $scope.animationsEnabled,
					    							      templateUrl: 'modalValidation.html',
					    							      controller: 'ModalInstanceCtrl',
					    							      resolve: {
					    							    	  validationText : function () {
					    							    		  return $scope.modalValidationText ;
					    							    	  }
					    							      }
					    						      });
					    		              return;
					    		            }
					    		            else {
					    		         	   var paymentInfo = {
					    		         		      amount                    : $scope.grandTotal,
					    		         		      billing                   : {
					    		         			       "firstName"          : $scope.billingFirstName,
					    		         			       "lastName"           : $scope.billingLastName,
					    		         			       "streetAddress"      : $scope.billAddressLine1,
					    		         			       "extendedAddress"    : $scope.billAddressLine2,
					    		         			       "locality"           : $scope.billCity,
					    		         			       "region"             : $scope.billState,
					    		         			       "postalCode"         : $scope.billZipCode  
					    		         			     },
					    		                      customerId                : $scope.storedCustomerDetails.BTreeCustId,
					    		         		      options: {
					    		         		    	  "submitForSettlement" : true
					    		         		    	 /*  "storeInVaultOnSuccess"  : $scope.storeCard  creates duplicate payment
					    		         		    	  *  methods for same card with different tokens . Using paymentMethod.create() instead */
					    		         		      }
					    		         	    }	
					    		              
					    		              if($scope.storeCard == true){
					    		            	 		   var pymtMethod = {
					    		            	 			  customerId:$scope.storedCustomerDetails.BTreeCustId,
					    		            	 			  paymentMethodNonce:payload.nonce
					    		            	 		   }
					    		            	 		   $http.post('/storeInVault',JSON.stringify(pymtMethod)).then(
					    		            	 				 function(response){
					    		            	 					 if(response.data.Result == "Success"){
					    		            	 						paymentInfo.paymentMethodToken = response.data.Token;
					    		            	 						checkOut(paymentInfo); 
					    		            	 					 }
					    		            	 					 else if(response.data == "401"){
					    		            							sessionStorage.setItem("sessionExpiredPage" , $location.path());
					    		            							sessionStorage.setItem("401", 'true');
					    		            							sessionStorage.removeItem("signedInCustomer");
					    		            							$location.path('/sessionExpired');  
					    		            	 					 }
					    		            	 					 else if(response.data == 'Exists'){
					    		            	 						$scope.hidePymtContainer = false ;
					    		            	 					  	$scope.modalValidationText = "Stored Payment method already exists."
					    		            								$uibModal.open({
					    		            								      animation: $scope.animationsEnabled,
					    		            								      templateUrl: 'modalValidation.html',
					    		            								      controller: 'ModalInstanceCtrl',
					    		            								      resolve: {
					    		            								    	  validationText : function () {
					    		            								    		  return $scope.modalValidationText ;
					    		            								    	  }
					    		            								      }
					    		            							  }); 
					    		            	 					 }
					    		            	 				 } ,
					    		            	 				 function(response){
					    		            	 					$scope.hidePymtContainer = false ;
					    		            	 				  	$scope.modalValidationText = "A server error occurred. Please try again."
					    		            							$uibModal.open({
					    		            							      animation: $scope.animationsEnabled,
					    		            							      templateUrl: 'modalValidation.html',
					    		            							      controller: 'ModalInstanceCtrl',
					    		            							      resolve: {
					    		            							    	  validationText : function () {
					    		            							    		  return $scope.modalValidationText ;
					    		            							    	  }
					    		            							      }
					    		            						  });
					    		            	 				 }
					    		            	 		   );
					    		               }
					    		               
					    		         	   else {
					    		         		  paymentInfo.paymentMethodNonce  = payload.nonce ;
					    		         		  checkOut(paymentInfo);
					    		         	   } 
					    		            } 
					    		          });    
			    		         });			    		       
			    		      });
			    		      
			    		    });        
			    	  } 
			    	else {
			    		sessionStorage.setItem("sessionExpiredPage" , $location.path());
						sessionStorage.setItem("401", 'true');
						sessionStorage.removeItem("signedInCustomer");
						$location.path('/sessionExpired'); 
			    	}
			    }
			    	else { /* Client token is not generated */
			    		$scope.hidePymtContainer = false ;
			    		$scope.modalValidationText = "An error occurred. Please re-load the page."
							$uibModal.open({
							      animation: $scope.animationsEnabled,
							      templateUrl: 'modalValidation.html',
							      controller: 'ModalInstanceCtrl',
							      resolve: {
							    	  validationText : function () {
							    		  return $scope.modalValidationText ;
							    	  }
							      }
						  });
			    	}
                }, /* Client token is not generated */
           function(response){ 
                	$scope.hidePymtContainer = false ;
                	$scope.modalValidationText = "A server error occurred. Please re-load the page."
							$uibModal.open({
							      animation: $scope.animationsEnabled,
							      templateUrl: 'modalValidation.html',
							      controller: 'ModalInstanceCtrl',
							      resolve: {
							    	  validationText : function () {
							    		  return $scope.modalValidationText ;
							    	  }
							      }
						  });
           });	
	     /* Stored payment method does not require braintree client instance for tokenization 
	      * of hosted fields instance */
	     $scope.$on('storedPymtSubmitRequest', function () {
	    	 var paymentInfo = {
       		      amount                    : $scope.grandTotal,
       		      paymentMethodToken        : $scope.pymtMethodToken,
       		      billing                   : {
       			       "firstName"          : $scope.billingFirstName,
       			       "lastName"           : $scope.billingLastName,
       			       "streetAddress"      : $scope.billAddressLine1,
       			       "extendedAddress"    : $scope.billAddressLine2,
       			       "locality"           : $scope.billCity,
       			       "region"             : $scope.billState,
       			       "postalCode"         : $scope.billZipCode  
       			     },
                    customerId                : $scope.storedCustomerDetails.BTreeCustId,
       		      options: {
       		    	  "submitForSettlement" : true
       		      }, 
       	    }	
	    	 checkOut(paymentInfo); 
	    });
	     
   }

   
   var checkOut = function(paymentInfo) {

	   $http.post('/checkout', JSON.stringify(paymentInfo)).then(
				   function(response){
					   var jsonResponse = response.data ;
					   if(jsonResponse.Result == 'Success'){
						  addCardOrder(jsonResponse.TxnId,jsonResponse.Last4, jsonResponse.Token, jsonResponse.CardType);  
					   }
					   else if (response.data == "401"){
							sessionStorage.setItem("sessionExpiredPage" , $location.path());
							sessionStorage.setItem("401", 'true');
							sessionStorage.removeItem("signedInCustomer");
							$location.path('/sessionExpired'); 
					   }
					   else {
						  $scope.hidePymtContainer = false ;
						  $scope.modalValidationText = "An error occurred. Please verify billing information and try again."
						  $uibModal.open({
						      animation: $scope.animationsEnabled,
						      templateUrl: 'modalValidation.html',
						      controller: 'ModalInstanceCtrl',
						      resolve: {
						    	  validationText : function () {
						    		  return $scope.modalValidationText ;
						    	  }
						      }
					      });  
					   }
				   },
				   function(response){
					  $scope.hidePymtContainer = false ;
					  $scope.modalValidationText = "A server error occurred. Please try again."
						  $uibModal.open({
						      animation: $scope.animationsEnabled,
						      templateUrl: 'modalValidation.html',
						      controller: 'ModalInstanceCtrl',
						      resolve: {
						    	  validationText : function () {
						    		  return $scope.modalValidationText ;
						    	  }
						      }
					      });     
				   });
   }
   
   
   var addCardOrder = function(transactionId, last4, pymtMethodToken, cardType) {
	   var transaction = {
			   'TransactionId':transactionId,
			   'Last4':last4,
			   'PymtMethodToken':pymtMethodToken
	   }
	   
	   sessionStorage.setItem('TxnCompleted', JSON.stringify(transaction));
	   if($scope.storeCard == true){
	
    	  var pymtMethod = {
    			  CustomerId : {
  					$ref: 'Customer',
  					$id: $scope.storedCustomerDetails._id 
  				  } ,
    			  PaymentMethod : {
    				  Token : pymtMethodToken,
    				  Card  : cardType+' XXXX'+last4
    			  } 
    	  }
    	 
          $http.post('/addPymtMethod', JSON.stringify(pymtMethod)).then(
    			function(response) {
    				if(response.data == 'Failed'){
    					 $scope.hidePymtContainer = false ;
    					 $scope.modalValidationText = "An error occurred. Please try again."
   						  $uibModal.open({
   						      animation: $scope.animationsEnabled,
   						      templateUrl: 'modalValidation.html',
   						      controller: 'ModalInstanceCtrl',
   						      resolve: {
   						    	  validationText : function () {
   						    		  return $scope.modalValidationText ;
   						    	  }
   						      }
   					      }); 
    			      return ;
    				}
    				else if(response.data == "401"){
    					console.log(response.data);
						sessionStorage.setItem("sessionExpiredPage" , $location.path());
						sessionStorage.setItem("401", 'true');
						sessionStorage.removeItem("signedInCustomer");
						$location.path('/sessionExpired');
    				}
    				else {
    			    	  $scope.customerPaymentInfo.paymentMethod = pymtMethod.PaymentMethod.Card ;
    			    	  $scope.orderDetails.OrderId = transactionId ;	
    			    	  addOrder();
    				}
    			},
    			function(response) {
    				 $scope.hidePymtContainer = false ;
    				 $scope.modalValidationText = "A server error occurred. Please try again."
						  $uibModal.open({
						      animation: $scope.animationsEnabled,
						      templateUrl: 'modalValidation.html',
						      controller: 'ModalInstanceCtrl',
						      resolve: {
						    	  validationText : function () {
						    		  return $scope.modalValidationText ;
						    	  }
						      }
					      }); 
    				return ;
    			}
    	 );
	   }
	   else{
		  if($scope.selectedCard != $scope.storedCards[0].Name){
		     $scope.customerPaymentInfo.paymentMethod = $scope.selectedCard ;
		  }
		  else {
			 $scope.customerPaymentInfo.paymentMethod = cardType+' XXXX'+last4 ;
		  }
		  $scope.orderDetails.OrderId = transactionId ;	
		  addOrder();
	   }
	  
   }
    
   
   var addOrder = function() {
	      
	   localStorage.setItem("customerPaymentInfo",JSON.stringify($scope.customerPaymentInfo));
		  $http.defaults.headers.post["Content-Type"] = "application/json";
			var addZero = function(i) {
			    if (i < 10) {
			        i = "0" + i;
			    }
			    return i;
			}
		   var orderResponse = {} ;
		   $scope.orderDetails.CustomerPhone = $scope.customerPaymentInfo.customerPhone ;
		   
		   $http.post('/addOrder',JSON.stringify($scope.orderDetails)).then(
					function(response){
						if(response.data != 'Failed'){
							if(response.data == "401"){
		    					console.log(response.data);
								sessionStorage.setItem("sessionExpiredPage" , $location.path());
								sessionStorage.setItem("401", 'true');
								sessionStorage.removeItem("signedInCustomer");
								$location.path('/sessionExpired');
		    				}
							else {
							    orderResponse = response.data ;
								var localDateTime = new Date(orderResponse.OrderTime);
								var time_hr = addZero(localDateTime.getHours()) ;
								var time_min = addZero(localDateTime.getMinutes()) ;
								var time_sec = addZero(localDateTime.getSeconds()) ;
								
								var AM_PM  = "" ;
								if(time_hr > 11){ 
									AM_PM = "PM" ;	
								}
								else { AM_PM = "AM" ;
								}
								var orderPlacedTime =  time_hr + ":" + time_min + ":" + time_sec + " " + AM_PM;
								var orderPlacedDate =  (localDateTime.getMonth()+1)+"/"+localDateTime.getDate()+"/"+localDateTime.getFullYear() ;
								orderResponse.OrderTime = orderPlacedTime ;
								orderResponse.OrderDate = orderPlacedDate ;
							    sessionStorage.setItem("orderPlacedTime", JSON.stringify(orderResponse));
							    $location.path('/order');
							}
						}
						else {
							$scope.hidePymtContainer = false ;
							$scope.modalValidationText = "An error occurred. Please try again."
		   						  $uibModal.open({
		   						      animation: $scope.animationsEnabled,
		   						      templateUrl: 'modalValidation.html',
		   						      controller: 'ModalInstanceCtrl',
		   						      resolve: {
		   						    	  validationText : function () {
		   						    		  return $scope.modalValidationText ;
		   						    	  }
		   						      }
		   					 }); 
						}
					},
					function(response){
						$scope.hidePymtContainer = false ;
						$scope.modalValidationText = "A server error occurred. Please try again."
	 						  $uibModal.open({
	 						      animation: $scope.animationsEnabled,
	 						      templateUrl: 'modalValidation.html',
	 						      controller: 'ModalInstanceCtrl',
	 						      resolve: {
	 						    	  validationText : function () {
	 						    		  return $scope.modalValidationText ;
	 						    	  }
	 						      }
	 					 });
					}
					); 	    
   }
   
   var getStoredPayments = function() {

	   var customer = {
	     CustomerId : {
					$ref: 'Customer',
					$id: $scope.storedCustomerDetails._id 
				}
	   }   
	   $http.post('/getStoredPymts' , JSON.stringify(customer)).then(
			function(response){
				if(response.data != 'Failed' ){
					if(response.data != 'Empty'){
						if(response.data == "401"){
							sessionStorage.setItem("sessionExpiredPage" , $location.path());
							sessionStorage.setItem("401", 'true');
							sessionStorage.removeItem("signedInCustomer");
							$location.path('/sessionExpired'); 
						}
						else {
							var storedPymts = response.data;
							angular.forEach(storedPymts, function(obj) {
								  var card = {
										  'Name' :obj.PaymentMethod.Card,
										  'Token' :obj.PaymentMethod.Token // For two cards ending in the same 'Last 4' .
								  } 
								  this.push(card);
								}, $scope.storedCards);
							onload();   
						}
					}
					else {
						onload(); 
					}
				}
				else {
					$scope.hidePymtContainer = false ;
					$scope.modalValidationText = "An error occurred. Please reload the page."
						  $uibModal.open({
						      animation: $scope.animationsEnabled,
						      templateUrl: 'modalValidation.html',
						      controller: 'ModalInstanceCtrl',
						      resolve: {
						    	  validationText : function () {
						    		  return $scope.modalValidationText ;
						    	  }
						      }
					}); 
				}
			},
			function(response){
				$scope.hidePymtContainer = false ;
				$scope.modalValidationText = "A server error occurred. Please reload the page."
					  $uibModal.open({
					      animation: $scope.animationsEnabled,
					      templateUrl: 'modalValidation.html',
					      controller: 'ModalInstanceCtrl',
					      resolve: {
					    	  validationText : function () {
					    		  return $scope.modalValidationText ;
					    	  }
					      }
				}); 
			}
	   )
   }
   
   var paymentDetailOnLoad = function () {
	   
	   $scope.orderItems = JSON.parse(localStorage.getItem("orderItems"));
	   $scope.grandTotal = localStorage.getItem("grandTotal");
	   if(sessionStorage.getItem("signedInCustomer") != null){
		    $scope.storedCustomerDetails = JSON.parse(sessionStorage.getItem("signedInCustomer"));
		    $scope.customerFirstName  = $scope.storedCustomerDetails.FirstName;
		    $scope.customerPaymentInfo.customerId = $scope.storedCustomerDetails._id ;
			$scope.customerPaymentInfo.customerName = $scope.storedCustomerDetails.FirstName ;
			$scope.billAddressLine1 = $scope.customerPaymentInfo.deliveryAddress.shipAddressLine1 = $scope.storedCustomerDetails.Address.AddressLine1  ;
			$scope.billAddressLine2 = $scope.customerPaymentInfo.deliveryAddress.shipAddressLine2 = $scope.storedCustomerDetails.Address.AddressLine2 ;
			$scope.billCity	= $scope.customerPaymentInfo.deliveryAddress.shipCity = $scope.storedCustomerDetails.Address.City ;
			$scope.billState = $scope.customerPaymentInfo.deliveryAddress.shipState = $scope.storedCustomerDetails.Address.State ;
			$scope.billZipCode = $scope.customerPaymentInfo.deliveryAddress.shipZipCode = $scope.storedCustomerDetails.Address.ZipCode ; 
			$scope.customerPaymentInfo.customerEmail = $scope.storedCustomerDetails.Email ;
			getStoredPayments();
			$scope.enableStoreCard();   
			$scope.orderDetails = {
						CustomerId : {
							$ref: 'Customer',
							$id: $scope.storedCustomerDetails._id 
						},
						OrderId : '',
						OrderItems : $scope.orderItems ,
						GrandTotal : $scope.grandTotal ,
						PaymentMethod : $scope.customerPaymentInfo.paymentMethod ,
						Reservation : 'Online',
						OrderStatus : 'Queue' ,
						StatusProgress : '',
						OrderTime : new Date(),
						DeliveryPerson:'',
						DeliveryTime:'',
						DeliveryAddress:$scope.customerPaymentInfo.deliveryAddress,
						CustomerPhone:''
		   }
			sessionStorage.removeItem("orderPlacedTime");
		}
	   else {
		   $location.path('/signIn');
	   }	   
   }
   paymentDetailOnLoad() ;  
});



first_app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, validationText,hideContainer) {
	   $scope.hideModal = function () {
		    $uibModalInstance.close();
		    hideContainer();
	   }
	   $scope.modalValidationText = validationText;    
});

first_app.controller('cardRemoveModalInstanceCtrl', function ($scope, $uibModalInstance, validationText , removeCard, hideContainer) {
	   $scope.hideModalYes = function () {
		    $uibModalInstance.close();
		    /*
			 * broadcasting the 'removeCardConfirmed' event in the shared
			 * service 'removeCard', to paymentDetailsController, to remove the
			 * stored payment method
			 */
		    
			removeCard();
			hideContainer();
	   }
	   $scope.hideModalNo = function () {
		    $uibModalInstance.close();
		    hideContainer();
	   }
	   $scope.modalValidationText = validationText;
});




/* browserify added code below > browserify paymentDetailsController.js -o output.js, for adding module 'braintree-web'  */
},{"braintree-web":2}],2:[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.braintree=e()}}(function(){var e;return function t(e,n,i){function r(a,s){if(!n[a]){if(!e[a]){var c="function"==typeof require&&require;if(!s&&c)return c(a,!0);if(o)return o(a,!0);var l=new Error("Cannot find module '"+a+"'");throw l.code="MODULE_NOT_FOUND",l}var d=n[a]={exports:{}};e[a][0].call(d.exports,function(t){var n=e[a][1][t];return r(n?n:t)},d,d.exports,t,e,n,i)}return n[a].exports}for(var o="function"==typeof require&&require,a=0;a<i.length;a++)r(i[a]);return r}({1:[function(e,t,n){"use strict";function i(e){var t,n,i;return e?(t=e.prefixPattern.source,n=e.exactPattern.source,i=JSON.parse(JSON.stringify(e)),i.prefixPattern=t,i.exactPattern=n,i):null}function r(e){var t,n,r,a=[],s=[];if(!("string"==typeof e||e instanceof String))return[];for(r=0;r<y.length;r++)t=y[r],n=o[t],0!==e.length?n.exactPattern.test(e)?s.push(i(n)):n.prefixPattern.test(e)&&a.push(i(n)):a.push(i(n));return s.length?s:a}var o={},a="visa",s="master-card",c="american-express",l="diners-club",d="discover",u="jcb",p="unionpay",_="maestro",f="CVV",h="CID",E="CVC",I="CVN",y=[a,s,c,l,d,u,p,_];o[a]={niceType:"Visa",type:a,prefixPattern:/^4$/,exactPattern:/^4\d*$/,gaps:[4,8,12],lengths:[16],code:{name:f,size:3}},o[s]={niceType:"MasterCard",type:s,prefixPattern:/^(5|5[1-5]|2|22|222|222[1-9]|2[3-6]|27[0-1]|2720)$/,exactPattern:/^(5[1-5]|222[1-9]|2[3-6]|27[0-1]|2720)\d*$/,gaps:[4,8,12],lengths:[16],code:{name:E,size:3}},o[c]={niceType:"American Express",type:c,prefixPattern:/^(3|34|37)$/,exactPattern:/^3[47]\d*$/,isAmex:!0,gaps:[4,10],lengths:[15],code:{name:h,size:4}},o[l]={niceType:"Diners Club",type:l,prefixPattern:/^(3|3[0689]|30[0-5])$/,exactPattern:/^3(0[0-5]|[689])\d*$/,gaps:[4,10],lengths:[14],code:{name:f,size:3}},o[d]={niceType:"Discover",type:d,prefixPattern:/^(6|60|601|6011|65|64|64[4-9])$/,exactPattern:/^(6011|65|64[4-9])\d*$/,gaps:[4,8,12],lengths:[16,19],code:{name:h,size:3}},o[u]={niceType:"JCB",type:u,prefixPattern:/^(2|21|213|2131|1|18|180|1800|3|35)$/,exactPattern:/^(2131|1800|35)\d*$/,gaps:[4,8,12],lengths:[16],code:{name:f,size:3}},o[p]={niceType:"UnionPay",type:p,prefixPattern:/^(6|62)$/,exactPattern:/^62\d*$/,gaps:[4,8,12],lengths:[16,17,18,19],code:{name:I,size:3}},o[_]={niceType:"Maestro",type:_,prefixPattern:/^(5|5[06-9]|6\d*)$/,exactPattern:/^5[06-9]\d*$/,gaps:[4,8,12],lengths:[12,13,14,15,16,17,18,19],code:{name:E,size:3}},r.getTypeInfo=function(e){return i(o[e])},r.types={VISA:a,MASTERCARD:s,AMERICAN_EXPRESS:c,DINERS_CLUB:l,DISCOVER:d,JCB:u,UNIONPAY:p,MAESTRO:_},t.exports=r},{}],2:[function(t,n,i){(function(t){"use strict";!function(r,o){"object"==typeof i&&"undefined"!=typeof n?n.exports=o("undefined"==typeof t?r:t):"function"==typeof e&&e.amd?e([],function(){return o(r)}):r.framebus=o(r)}(this,function(e){function t(e){return null==e?!1:null==e.Window?!1:e.constructor!==e.Window?!1:(N.push(e),!0)}function n(e){var t,n={};for(t in A)A.hasOwnProperty(t)&&(n[t]=A[t]);return n._origin=e||"*",n}function i(e){var t,n,i=a(this);return s(e)?!1:s(i)?!1:(n=Array.prototype.slice.call(arguments,1),t=c(e,n,i),t===!1?!1:(h(m.top,t,i),!0))}function r(e,t){var n=a(this);return y(e,t,n)?!1:(T[n]=T[n]||{},T[n][e]=T[n][e]||[],T[n][e].push(t),!0)}function o(e,t){var n,i,r=a(this);if(y(e,t,r))return!1;if(i=T[r]&&T[r][e],!i)return!1;for(n=0;n<i.length;n++)if(i[n]===t)return i.splice(n,1),!0;return!1}function a(e){return e&&e._origin||"*"}function s(e){return"string"!=typeof e}function c(e,t,n){var i=!1,r={event:e,origin:n},o=t[t.length-1];"function"==typeof o&&(r.reply=I(o,n),t=t.slice(0,-1)),r.args=t;try{i=O+JSON.stringify(r)}catch(a){throw new Error("Could not stringify event: "+a.message)}return i}function l(e){var t,n,i,r;if(e.data.slice(0,O.length)!==O)return!1;try{t=JSON.parse(e.data.slice(O.length))}catch(o){return!1}return null!=t.reply&&(n=e.origin,i=e.source,r=t.reply,t.reply=function(e){var t=c(r,[e],n);return t===!1?!1:void i.postMessage(t,n)},t.args.push(t.reply)),t}function d(t){m||(m=t||e,m.addEventListener?m.addEventListener("message",p,!1):m.attachEvent?m.attachEvent("onmessage",p):null===m.onmessage?m.onmessage=p:m=null)}function u(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0,n="x"===e?t:3&t|8;return n.toString(16)})}function p(e){var t;s(e.data)||(t=l(e),t&&(_("*",t.event,t.args,e),_(e.origin,t.event,t.args,e),E(e.data,t.origin,e.source)))}function _(e,t,n,i){var r;if(T[e]&&T[e][t])for(r=0;r<T[e][t].length;r++)T[e][t][r].apply(i,n)}function f(e){return e.top!==e?!1:null==e.opener?!1:e.opener===e?!1:e.opener.closed===!0?!1:!0}function h(e,t,n){var i;try{for(e.postMessage(t,n),f(e)&&h(e.opener.top,t,n),i=0;i<e.frames.length;i++)h(e.frames[i],t,n)}catch(r){}}function E(e,t,n){var i,r;for(i=N.length-1;i>=0;i--)r=N[i],r.closed===!0?N=N.slice(i,1):n!==r&&h(r.top,e,t)}function I(e,t){function n(r,o){e(r,o),A.target(t).unsubscribe(i,n)}var i=u();return A.target(t).subscribe(i,n),i}function y(e,t,n){return s(e)?!0:"function"!=typeof t?!0:s(n)?!0:!1}var m,A,N=[],T={},O="/*framebus*/";return d(),A={target:n,include:t,publish:i,pub:i,trigger:i,emit:i,subscribe:r,sub:r,on:r,unsubscribe:o,unsub:o,off:o}})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],3:[function(e,t,n){"use strict";var i=e("./lib/set-attributes"),r=e("./lib/default-attributes"),o=e("./lib/assign");t.exports=function(e){var t=document.createElement("iframe"),n=o({},r,e);return n.style&&"string"!=typeof n.style&&(o(t.style,n.style),delete n.style),i(t,n),t.getAttribute("id")||(t.id=t.name),t}},{"./lib/assign":4,"./lib/default-attributes":5,"./lib/set-attributes":6}],4:[function(e,t,n){"use strict";t.exports=function(e){var t=Array.prototype.slice.call(arguments,1);return t.forEach(function(t){"object"==typeof t&&Object.keys(t).forEach(function(n){e[n]=t[n]})}),e}},{}],5:[function(e,t,n){t.exports={src:"about:blank",frameBorder:0,allowtransparency:!0,scrolling:"no"}},{}],6:[function(e,t,n){"use strict";t.exports=function(e,t){var n;for(var i in t)t.hasOwnProperty(i)&&(n=t[i],null==n?e.removeAttribute(i):e.setAttribute(i,n))}},{}],7:[function(e,t,n){"use strict";function i(e){this._client=e.client}var r=e("../lib/error"),o=e("../lib/deferred"),a=e("./errors"),s=e("../lib/throw-if-no-callback");i.prototype.getRewardsBalance=function(e,t){return s(t,"getRewardsBalance"),t=o(t),e.nonce?void this._client.request({method:"get",endpoint:"payment_methods/amex_rewards_balance",data:{_meta:{source:"american-express"},paymentMethodNonce:e.nonce}},function(e,n){e?t(new r({type:a.AMEX_NETWORK_ERROR.type,code:a.AMEX_NETWORK_ERROR.code,message:"A network error occurred when getting the American Express rewards balance.",details:{originalError:e}})):t(null,n)}):void t(new r({type:a.AMEX_NONCE_REQUIRED.type,code:a.AMEX_NONCE_REQUIRED.code,message:"getRewardsBalance must be called with a nonce."}))},i.prototype.getExpressCheckoutProfile=function(e,t){return s(t,"getExpressCheckoutProfile"),t=o(t),e.nonce?void this._client.request({method:"get",endpoint:"payment_methods/amex_express_checkout_cards/"+e.nonce,data:{_meta:{source:"american-express"},paymentMethodNonce:e.nonce}},function(e,n){e?t(new r({type:a.AMEX_NETWORK_ERROR.type,code:a.AMEX_NETWORK_ERROR.code,message:"A network error occurred when getting the American Express Checkout nonce profile.",details:{originalError:e}})):t(null,n)}):void t(new r({type:a.AMEX_NONCE_REQUIRED.type,code:a.AMEX_NONCE_REQUIRED.code,message:"getExpressCheckoutProfile must be called with a nonce."}))},t.exports=i},{"../lib/deferred":50,"../lib/error":53,"../lib/throw-if-no-callback":71,"./errors":8}],8:[function(e,t,n){"use strict";var i=e("../lib/error");t.exports={AMEX_NONCE_REQUIRED:{type:i.types.MERCHANT,code:"AMEX_NONCE_REQUIRED"},AMEX_NETWORK_ERROR:{type:i.types.NETWORK,code:"AMEX_NETWORK_ERROR"}}},{"../lib/error":53}],9:[function(e,t,n){"use strict";function i(e,t){var n;return l(t,"create"),t=a(t),null==e.client?void t(new r({type:s.INSTANTIATION_OPTION_REQUIRED.type,code:s.INSTANTIATION_OPTION_REQUIRED.code,message:"options.client is required when instantiating American Express."})):(n=e.client.getConfiguration().analyticsMetadata.sdkVersion,n!==c?void t(new r({type:s.INCOMPATIBLE_VERSIONS.type,code:s.INCOMPATIBLE_VERSIONS.code,message:"Client (version "+n+") and American Express (version "+c+") components must be from the same SDK version."})):void t(null,new o(e)))}var r=e("../lib/error"),o=e("./american-express"),a=e("../lib/deferred"),s=e("../errors"),c="3.5.0",l=e("../lib/throw-if-no-callback");t.exports={create:i,VERSION:c}},{"../errors":29,"../lib/deferred":50,"../lib/error":53,"../lib/throw-if-no-callback":71,"./american-express":7}],10:[function(e,t,n){(function(n){"use strict";function i(e){this._client=e.client,Object.defineProperty(this,"merchantIdentifier",{value:this._client.getConfiguration().gatewayConfiguration.applePayWeb.merchantIdentifier,configurable:!1,writable:!1})}var r=e("../lib/error"),o=e("../lib/analytics"),a=e("../lib/deferred"),s=e("../errors"),c=e("./errors");i.prototype.createPaymentRequest=function(e){var t=this._client.getConfiguration().gatewayConfiguration.applePayWeb,n={countryCode:t.countryCode,currencyCode:t.currencyCode,merchantCapabilities:t.merchantCapabilities||["supports3DS"],supportedNetworks:t.supportedNetworks.map(function(e){return"mastercard"===e?"masterCard":e})};return Object.assign({},n,e)},i.prototype.performValidation=function(e,t){var i;if("function"!=typeof t)throw new r({type:s.CALLBACK_REQUIRED.type,code:s.CALLBACK_REQUIRED.code,message:"performValidation requires a callback."});return t=a(t),e&&e.validationURL?(i={validationUrl:e.validationURL,domainName:e.domainName||n.location.hostname,merchantIdentifier:e.merchantIdentifier||this.merchantIdentifier},null!=e.displayName&&(i.displayName=e.displayName),void this._client.request({method:"post",endpoint:"apple_pay_web/sessions",data:{_meta:{source:"apple-pay"},applePayWebSession:i}},function(e,n){e?(t("CLIENT_REQUEST_ERROR"===e.code?new r({type:c.APPLE_PAY_MERCHANT_VALIDATION_FAILED.type,code:c.APPLE_PAY_MERCHANT_VALIDATION_FAILED.code,message:c.APPLE_PAY_MERCHANT_VALIDATION_FAILED.message,details:{originalError:e.details.originalError}}):new r({type:c.APPLE_PAY_MERCHANT_VALIDATION_NETWORK.type,code:c.APPLE_PAY_MERCHANT_VALIDATION_NETWORK.code,message:c.APPLE_PAY_MERCHANT_VALIDATION_NETWORK.message,details:{originalError:e}})),o.sendEvent(this._client,"web.applepay.performValidation.failed")):(t(null,n),o.sendEvent(this._client,"web.applepay.performValidation.succeeded"))}.bind(this))):void t(new r(c.APPLE_PAY_VALIDATION_URL_REQUIRED))},i.prototype.tokenize=function(e,t){if("function"!=typeof t)throw new r({type:s.CALLBACK_REQUIRED.type,code:s.CALLBACK_REQUIRED.code,message:"tokenize requires a callback."});return t=a(t),e.token?void this._client.request({method:"post",endpoint:"payment_methods/apple_payment_tokens",data:{_meta:{source:"apple-pay"},applePaymentToken:Object.assign({},e.token,{paymentData:btoa(JSON.stringify(e.token.paymentData))})}},function(e,n){e?(t(new r({type:c.APPLE_PAY_TOKENIZATION.type,code:c.APPLE_PAY_TOKENIZATION.code,message:c.APPLE_PAY_TOKENIZATION.message,details:{originalError:e}})),o.sendEvent(this._client,"web.applepay.tokenize.failed")):(t(null,n.applePayCards[0]),o.sendEvent(this._client,"web.applepay.tokenize.succeeded"))}.bind(this)):void t(new r(c.APPLE_PAY_PAYMENT_TOKEN_REQUIRED))},t.exports=i}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../errors":29,"../lib/analytics":39,"../lib/deferred":50,"../lib/error":53,"./errors":11}],11:[function(e,t,n){"use strict";var i=e("../lib/error");t.exports={APPLE_PAY_NOT_ENABLED:{type:i.types.MERCHANT,code:"APPLE_PAY_NOT_ENABLED",message:"Apple Pay is not enabled for this merchant."},APPLE_PAY_VALIDATION_URL_REQUIRED:{type:i.types.MERCHANT,code:"APPLE_PAY_VALIDATION_URL_REQUIRED",message:"performValidation must be called with a validationURL."},APPLE_PAY_MERCHANT_VALIDATION_NETWORK:{type:i.types.NETWORK,code:"APPLE_PAY_MERCHANT_VALIDATION_NETWORK",message:"A network error occurred when validating the Apple Pay merchant."},APPLE_PAY_MERCHANT_VALIDATION_FAILED:{type:i.types.MERCHANT,code:"APPLE_PAY_MERCHANT_VALIDATION_FAILED",message:"Make sure you have registered your domain name in the Braintree Control Panel."},APPLE_PAY_PAYMENT_TOKEN_REQUIRED:{type:i.types.MERCHANT,code:"APPLE_PAY_PAYMENT_TOKEN_REQUIRED",message:"tokenize must be called with a payment token."},APPLE_PAY_TOKENIZATION:{type:i.types.NETWORK,code:"APPLE_PAY_TOKENIZATION",message:"A network error occurred when processing the Apple Pay payment."}}},{"../lib/error":53}],12:[function(e,t,n){"use strict";function i(e,t){var n;return c(t,"create"),t=s(t),null==e.client?void t(new r({type:l.INSTANTIATION_OPTION_REQUIRED.type,code:l.INSTANTIATION_OPTION_REQUIRED.code,message:"options.client is required when instantiating Apple Pay."})):(n=e.client.getConfiguration().analyticsMetadata.sdkVersion,n!==u?void t(new r({type:l.INCOMPATIBLE_VERSIONS.type,code:l.INCOMPATIBLE_VERSIONS.code,message:"Client (version "+n+") and Apple Pay (version "+u+") components must be from the same SDK version."})):e.client.getConfiguration().gatewayConfiguration.applePayWeb?(a.sendEvent(e.client,"web.applepay.initialized"),void t(null,new o(e))):void t(new r(d.APPLE_PAY_NOT_ENABLED)))}var r=e("../lib/error"),o=e("./apple-pay"),a=e("../lib/analytics"),s=e("../lib/deferred"),c=e("../lib/throw-if-no-callback"),l=e("../errors"),d=e("./errors"),u="3.5.0";t.exports={create:i,VERSION:u}},{"../errors":29,"../lib/analytics":39,"../lib/deferred":50,"../lib/error":53,"../lib/throw-if-no-callback":71,"./apple-pay":10,"./errors":11}],13:[function(e,t,n){"use strict";function i(e){var t,n;if(e=e||{},t=JSON.stringify(e),n=e.gatewayConfiguration,!n)throw new a(l.CLIENT_MISSING_GATEWAY_CONFIGURATION);["assetsUrl","clientApiUrl","configUrl"].forEach(function(e){if(e in n&&!o(n[e]))throw new a({type:l.CLIENT_GATEWAY_CONFIGURATION_INVALID_DOMAIN.type,code:l.CLIENT_GATEWAY_CONFIGURATION_INVALID_DOMAIN.code,message:e+" property is on an invalid domain."})}),this.getConfiguration=function(){return JSON.parse(t)},this._request=r,this._baseUrl=e.gatewayConfiguration.clientApiUrl+"/v1/",this._configuration=this.getConfiguration(),this.toJSON=this.getConfiguration}var r=e("./request"),o=e("../lib/is-whitelisted-domain"),a=e("../lib/error"),s=e("../lib/add-metadata"),c=e("../lib/deferred"),l=e("./errors");i.prototype.request=function(e,t){var n;return e.method?e.endpoint||(n="options.endpoint"):n="options.method",n?(t=c(t),void t(new a({type:l.CLIENT_OPTION_REQUIRED.type,code:l.CLIENT_OPTION_REQUIRED.code,message:n+" is required when making a request."}))):void this._request({url:this._baseUrl+e.endpoint,method:e.method,data:s(this._configuration,e.data),headers:e._headers,timeout:e.timeout},this._bindRequestCallback(t))},i.prototype._bindRequestCallback=function(e){return function(t,n,i){-1===i?e(new a(l.CLIENT_REQUEST_TIMEOUT),null,i):403===i?e(new a(l.CLIENT_AUTHORIZATION_INSUFFICIENT),null,i):429===i?e(new a(l.CLIENT_RATE_LIMITED),null,i):i>=500?e(new a(l.CLIENT_GATEWAY_NETWORK),null,i):200>i||i>=400?e(new a({type:l.CLIENT_REQUEST_ERROR.type,code:l.CLIENT_REQUEST_ERROR.code,message:l.CLIENT_REQUEST_ERROR.message,details:{originalError:t}}),null,i):e(null,n,i)}},t.exports=i},{"../lib/add-metadata":38,"../lib/deferred":50,"../lib/error":53,"../lib/is-whitelisted-domain":65,"./errors":14,"./request":19}],14:[function(e,t,n){"use strict";var i=e("../lib/error");t.exports={CLIENT_GATEWAY_CONFIGURATION_INVALID_DOMAIN:{type:i.types.MERCHANT,code:"CLIENT_GATEWAY_CONFIGURATION_INVALID_DOMAIN"},CLIENT_OPTION_REQUIRED:{type:i.types.MERCHANT,code:"CLIENT_OPTION_REQUIRED"},CLIENT_MISSING_GATEWAY_CONFIGURATION:{type:i.types.INTERNAL,code:"CLIENT_MISSING_GATEWAY_CONFIGURATION",message:"Missing gatewayConfiguration."},CLIENT_INVALID_AUTHORIZATION:{type:i.types.MERCHANT,code:"CLIENT_INVALID_AUTHORIZATION",message:"Authorization is invalid. Make sure your client token or tokenization key is valid."},CLIENT_GATEWAY_NETWORK:{type:i.types.NETWORK,code:"CLIENT_GATEWAY_NETWORK",message:"Cannot contact the gateway at this time."},CLIENT_REQUEST_TIMEOUT:{type:i.types.NETWORK,code:"CLIENT_REQUEST_TIMEOUT",message:"Request timed out waiting for a reply."},CLIENT_REQUEST_ERROR:{type:i.types.NETWORK,code:"CLIENT_REQUEST_ERROR",message:"There was a problem with your request."},CLIENT_RATE_LIMITED:{type:i.types.MERCHANT,code:"CLIENT_RATE_LIMITED",message:"You are being rate-limited; please try again in a few minutes."},CLIENT_AUTHORIZATION_INSUFFICIENT:{type:i.types.MERCHANT,code:"CLIENT_AUTHORIZATION_INSUFFICIENT",message:"The authorization used has insufficient privileges."}}},{"../lib/error":53}],15:[function(e,t,n){(function(n){"use strict";function i(e,t){var i,d,u,p,_=a(),f={merchantAppId:n.location.host,platform:s.PLATFORM,sdkVersion:s.VERSION,source:s.SOURCE,integration:s.INTEGRATION,integrationType:s.INTEGRATION,sessionId:_};try{d=c(e.authorization)}catch(h){return void t(new r(l.CLIENT_INVALID_AUTHORIZATION))}u=d.attrs,p=d.configUrl,u._meta=f,u.braintreeLibraryVersion=s.BRAINTREE_LIBRARY_VERSION,u.configVersion="3",o({url:p,method:"GET",data:u},function(n,o,a){var s;return n?(s=403===a?l.CLIENT_AUTHORIZATION_INSUFFICIENT:l.CLIENT_GATEWAY_NETWORK,void t(new r({type:s.type,code:s.code,message:s.message,details:{originalError:n}}))):(i={authorization:e.authorization,authorizationType:u.tokenizationKey?"TOKENIZATION_KEY":"CLIENT_TOKEN",analyticsMetadata:f,gatewayConfiguration:o},void t(null,i))})}var r=e("../lib/error"),o=e("./request"),a=e("../lib/uuid"),s=e("../lib/constants"),c=e("../lib/create-authorization-data"),l=e("./errors");t.exports={getConfiguration:i}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../lib/constants":47,"../lib/create-authorization-data":49,"../lib/error":53,"../lib/uuid":72,"./errors":14,"./request":19}],16:[function(e,t,n){"use strict";function i(e,t){return s(t,"create"),t=l(t),e.authorization?void a(e,function(e,n){var i;if(e)return void t(e);try{i=new o(n)}catch(r){return void t(r)}t(null,i)}):void t(new r({type:d.INSTANTIATION_OPTION_REQUIRED.type,code:d.INSTANTIATION_OPTION_REQUIRED.code,message:"options.authorization is required when instantiating a client."}))}var r=e("../lib/error"),o=e("./client"),a=e("./get-configuration").getConfiguration,s=e("../lib/throw-if-no-callback"),c="3.5.0",l=e("../lib/deferred"),d=e("../errors");t.exports={create:i,VERSION:c}},{"../errors":29,"../lib/deferred":50,"../lib/error":53,"../lib/throw-if-no-callback":71,"./client":13,"./get-configuration":15}],17:[function(e,t,n){(function(n){"use strict";function i(){return c?new XMLHttpRequest:new XDomainRequest}function r(e,t){var n,r,l=e.method,d=e.url,u=e.data,p=e.timeout,_=e.headers||{},f=i(),h=t;"GET"===l&&(d=o.queryify(d,u),u=null),c?f.onreadystatechange=function(){4===f.readyState&&(n=f.status,r=s(f.responseText),n>=400||200>n?h(r||"error",null,n||500):h(null,r,n))}:(f.onload=function(){h(null,s(f.responseText),f.status)},f.onerror=function(){h("error",null,500)},f.onprogress=function(){},f.ontimeout=function(){h("timeout",null,-1)}),f.open(l,d,!0),f.timeout=p,c&&"POST"===l&&(f.setRequestHeader("Content-Type","application/json"),Object.keys(_).forEach(function(e){f.setRequestHeader(e,_[e])}));try{f.send(a(l,u))}catch(E){}}var o=e("../../lib/querystring"),a=e("./prep-body"),s=e("./parse-body"),c=n.XMLHttpRequest&&"withCredentials"in new n.XMLHttpRequest;t.exports={request:r}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../../lib/querystring":70,"./parse-body":22,"./prep-body":23}],18:[function(e,t,n){(function(e){"use strict";t.exports=function(){return e.navigator.userAgent}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],19:[function(e,t,n){"use strict";function i(){return null==r&&(r=!(l()&&/MSIE\s(8|9)/.test(c()))),r}var r,o=e("../../lib/once"),a=e("./jsonp-driver"),s=e("./ajax-driver"),c=e("./get-user-agent"),l=e("./is-http");t.exports=function(e,t){t=o(t||Function.prototype),e.method=(e.method||"GET").toUpperCase(),e.timeout=null==e.timeout?6e4:e.timeout,e.data=e.data||{},i()?s.request(e,t):a.request(e,t)}},{"../../lib/once":68,"./ajax-driver":17,"./get-user-agent":18,"./is-http":20,"./jsonp-driver":21}],20:[function(e,t,n){(function(e){"use strict";t.exports=function(){return"http:"===e.location.protocol}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],21:[function(e,t,n){(function(n){"use strict";function i(e){e&&e.parentNode&&e.parentNode.removeChild(e)}function r(e,t){var i=document.createElement("script"),r=!1;return i.src=e,i.async=!0,i.onerror=function(){n[t]({message:"error",status:500})},i.onload=i.onreadystatechange=function(){r||this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState||(r=!0,i.onload=i.onreadystatechange=null)},i}function o(e){try{delete n[e]}catch(t){n[e]=null}}function a(e,t){p[t]=setTimeout(function(){p[t]=null,n[t]({error:"timeout",status:-1}),n[t]=function(){o(t)}},e)}function s(e,t,r){n[r]=function(n){var a=n.status||500,s=null,c=null;delete n.status,a>=400||200>a?s=n:c=n,o(r),i(e),clearTimeout(p[r]),t(s,c,a)}}function c(e,t){var n,i="callback_json_"+d().replace(/-/g,""),o=e.url,c=e.data,p=e.method,_=e.timeout;o=u.queryify(o,c),o=u.queryify(o,{_method:p,callback:i}),n=r(o,i),s(n,t,i),a(_,i),l||(l=document.getElementsByTagName("head")[0]),l.appendChild(n)}var l,d=e("../../lib/uuid"),u=e("../../lib/querystring"),p={};t.exports={request:c}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../../lib/querystring":70,"../../lib/uuid":72}],22:[function(e,t,n){"use strict";t.exports=function(e){try{e=JSON.parse(e)}catch(t){}return e}},{}],23:[function(e,t,n){"use strict";t.exports=function(e,t){if("string"!=typeof e)throw new Error("Method must be a string");return"get"!==e.toLowerCase()&&null!=t&&(t="string"==typeof t?t:JSON.stringify(t)),t}},{}],24:[function(e,t,n){"use strict";var i=e("../lib/error");t.exports={DATA_COLLECTOR_KOUNT_NOT_ENABLED:{type:i.types.MERCHANT,code:"DATA_COLLECTOR_KOUNT_NOT_ENABLED",message:"Kount is not enabled for this merchant."},DATA_COLLECTOR_KOUNT_ERROR:{type:i.types.MERCHANT,code:"DATA_COLLECTOR_KOUNT_ERROR"},DATA_COLLECTOR_PAYPAL_NOT_ENABLED:{type:i.types.MERCHANT,code:"DATA_COLLECTOR_PAYPAL_NOT_ENABLED",message:"PayPal is not enabled for this merchant."},DATA_COLLECTOR_REQUIRES_CREATE_OPTIONS:{type:i.types.MERCHANT,code:"DATA_COLLECTOR_REQUIRES_CREATE_OPTIONS",message:"Data Collector must be created with Kount and/or PayPal."}}},{"../lib/error":53}],25:[function(e,t,n){"use strict";function i(){return new r}function r(){this.sessionId=o(),this._beaconId=a(this.sessionId),this._parameterBlock=s(this.sessionId,this._beaconId),this._thirdPartyBlock=c()}function o(){var e,t="";for(e=0;32>e;e++)t+=Math.floor(16*Math.random()).toString(16);return t}function a(e){var t=(new Date).getTime()/1e3;return"https://b.stats.paypal.com/counter.cgi?i=127.0.0.1&p="+e+"&t="+t+"&a=14"}function s(e,t){var n=document.body.appendChild(document.createElement("script"));return n.type="application/json",n.setAttribute("fncls","fnparams-dede7cc5-15fd-4c75-a9f4-36c430ee3a99"),n.text=JSON.stringify({f:e,s:"BRAINTREE_SIGNIN",b:t}),n}function c(){function e(){n._l()}var t,n,i="https://www.paypalobjects.com/webstatic/r/fb/",r=document.createElement("iframe");r.src="about:blank",r.title="",r.role="presentation",(r.frameElement||r).style.cssText="width: 0; height: 0; border: 0",document.body.appendChild(r);try{n=r.contentWindow.document}catch(o){t=document.domain,r.src='javascript:var d=document.open();d.domain="'+t+'";void(0);',n=r.contentWindow.document}return n.open()._l=function(){var e=this.createElement("script");t&&(this.domain=t),e.id="js-iframe-async",e.src=i+"fb-all-prod.pp.min.js",this.body.appendChild(e)},r.addEventListener?r.addEventListener("load",e,!1):r.attachEvent?r.attachEvent("onload",e):n.write('<body onload="document._l();">'),n.close(),r}r.prototype.teardown=function(){this._thirdPartyBlock.parentNode.removeChild(this._thirdPartyBlock)},t.exports={setup:i}},{}],26:[function(e,t,n){"use strict";function i(e,t){function n(e){var t;for(t=0;t<m.length;t++)m[t].teardown();l(E,s(E)),e&&(e=d(e))()}var i,f,h,E,I,y,m=[];if(c(t,"create"),t=d(t),null==e.client)return void t(new a({type:p.INSTANTIATION_OPTION_REQUIRED.type,code:p.INSTANTIATION_OPTION_REQUIRED.code,message:"options.client is required when instantiating Data Collector."}));if(I=e.client.getConfiguration(),y=I.analyticsMetadata.sdkVersion,y!==u)return void t(new a({type:p.INCOMPATIBLE_VERSIONS.type,code:p.INCOMPATIBLE_VERSIONS.code,message:"Client (version "+y+") and Data Collector (version "+u+") components must be from the same SDK version."}));if(e.kount===!0){if(!I.gatewayConfiguration.kount)return void t(new a(_.DATA_COLLECTOR_KOUNT_NOT_ENABLED));try{f=r.setup({environment:I.gatewayConfiguration.environment,merchantId:I.gatewayConfiguration.kount.kountMerchantId})}catch(A){return void t(new a({type:_.DATA_COLLECTOR_KOUNT_ERROR.type,code:_.DATA_COLLECTOR_KOUNT_ERROR.code,message:A.message}))}i=f.deviceData,m.push(f)}else i={};if(e.paypal===!0){if(I.gatewayConfiguration.paypalEnabled!==!0)return void t(new a(_.DATA_COLLECTOR_PAYPAL_NOT_ENABLED));h=o.setup(),i.correlation_id=h.sessionId,m.push(h)}return 0===m.length?void t(new a(_.DATA_COLLECTOR_REQUIRES_CREATE_OPTIONS)):(E={deviceData:JSON.stringify(i),teardown:n},void t(null,E))}var r=e("./kount"),o=e("./fraudnet"),a=e("../lib/error"),s=e("../lib/methods"),c=e("../lib/throw-if-no-callback"),l=e("../lib/convert-methods-to-error"),d=e("../lib/deferred"),u="3.5.0",p=e("../errors"),_=e("./errors");t.exports={create:i,VERSION:u}},{"../errors":29,"../lib/convert-methods-to-error":48,"../lib/deferred":50,"../lib/error":53,"../lib/methods":67,"../lib/throw-if-no-callback":71,"./errors":24,"./fraudnet":25,"./kount":27}],27:[function(e,t,n){"use strict";function i(e){var t=null!=e?e:{};return new r(t)}function r(e){o.random.startCollectors(),this._currentEnvironment=this._initializeEnvironment(e),this._deviceSessionId=this._generateDeviceSessionId(),this.deviceData=this._getDeviceData(),this._iframe=this._setupIFrame()}var o=e("./vendor/sjcl"),a="https://assets.qa.braintreepayments.com/data",s="braintreeDataFrame",c={development:a,qa:a,sandbox:"https://assets.braintreegateway.com/sandbox/data",production:"https://assets.braintreegateway.com/data"};r.prototype.teardown=function(){o.random.stopCollectors(),this._removeIframe()},r.prototype._removeIframe=function(){this._iframe.parentNode.removeChild(this._iframe)},r.prototype._getDeviceData=function(){return{device_session_id:this._deviceSessionId,fraud_merchant_id:this._currentEnvironment.id}},r.prototype._generateDeviceSessionId=function(){var e,t;return e=o.random.randomWords(4,0),t=o.codec.hex.fromBits(e)},r.prototype._setupIFrame=function(){var e,t=this,n=document.getElementById(s);return null!=n?n:(e="?m="+this._currentEnvironment.id+"&s="+this._deviceSessionId,n=document.createElement("iframe"),n.width=1,n.id=s,n.height=1,n.frameBorder=0,n.scrolling="no",document.body.appendChild(n),setTimeout(function(){n.src=t._currentEnvironment.url+"/logo.htm"+e,n.innerHTML='<img src="'+t._currentEnvironment.url+"/logo.gif"+e+'" />'},10),n)},r.prototype._initializeEnvironment=function(e){var t=c[e.environment];if(null==t)throw new Error(e.environment+" is not a valid environment for kount.environment");return{url:t,name:e.environment,id:e.merchantId}},t.exports={setup:i,Kount:r,environmentUrls:c}},{"./vendor/sjcl":28}],28:[function(t,n,i){"use strict";function r(e,t,n){if(4!==t.length)throw new u.exception.invalid("invalid aes block size");var i=e.b[n],r=t[0]^i[0],o=t[n?3:1]^i[1],a=t[2]^i[2];t=t[n?1:3]^i[3];var s,c,l,d,p=i.length/4-2,_=4,f=[0,0,0,0];s=e.l[n],e=s[0];var h=s[1],E=s[2],I=s[3],y=s[4];for(d=0;p>d;d++)s=e[r>>>24]^h[o>>16&255]^E[a>>8&255]^I[255&t]^i[_],c=e[o>>>24]^h[a>>16&255]^E[t>>8&255]^I[255&r]^i[_+1],l=e[a>>>24]^h[t>>16&255]^E[r>>8&255]^I[255&o]^i[_+2],t=e[t>>>24]^h[r>>16&255]^E[o>>8&255]^I[255&a]^i[_+3],_+=4,r=s,o=c,a=l;for(d=0;4>d;d++)f[n?3&-d:d]=y[r>>>24]<<24^y[o>>16&255]<<16^y[a>>8&255]<<8^y[255&t]^i[_++],s=r,r=o,o=a,a=t,t=s;return f}function o(e,t){var n,i,r,o=e.u,a=e.b,s=o[0],c=o[1],l=o[2],d=o[3],u=o[4],p=o[5],_=o[6],f=o[7];for(n=0;64>n;n++)16>n?i=t[n]:(i=t[n+1&15],r=t[n+14&15],i=t[15&n]=(i>>>7^i>>>18^i>>>3^i<<25^i<<14)+(r>>>17^r>>>19^r>>>10^r<<15^r<<13)+t[15&n]+t[n+9&15]|0),i=i+f+(u>>>6^u>>>11^u>>>25^u<<26^u<<21^u<<7)+(_^u&(p^_))+a[n],f=_,_=p,p=u,u=d+i|0,d=l,l=c,c=s,s=i+(c&l^d&(c^l))+(c>>>2^c>>>13^c>>>22^c<<30^c<<19^c<<10)|0;o[0]=o[0]+s|0,o[1]=o[1]+c|0,o[2]=o[2]+l|0,o[3]=o[3]+d|0,o[4]=o[4]+u|0,o[5]=o[5]+p|0,o[6]=o[6]+_|0,o[7]=o[7]+f|0}function a(e,t){var n,i=u.random.B[e],r=[];for(n in i)i.hasOwnProperty(n)&&r.push(i[n]);for(n=0;n<r.length;n++)r[n](t)}function s(e,t){"undefined"!=typeof window&&window.performance&&"function"==typeof window.performance.now?e.addEntropy(window.performance.now(),t,"loadtime"):e.addEntropy((new Date).valueOf(),t,"loadtime")}function c(e){e.b=l(e).concat(l(e)),e.C=new u.cipher.aes(e.b)}function l(e){for(var t=0;4>t&&(e.g[t]=e.g[t]+1|0,!e.g[t]);t++);return e.C.encrypt(e.g)}function d(e,t){return function(){t.apply(e,arguments)}}var u={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(e){this.toString=function(){return"CORRUPT: "+this.message},this.message=e},invalid:function(e){this.toString=function(){return"INVALID: "+this.message},this.message=e},bug:function(e){this.toString=function(){return"BUG: "+this.message},this.message=e},notReady:function(e){this.toString=function(){return"NOT READY: "+this.message},this.message=e}}};u.cipher.aes=function(e){this.l[0][0][0]||this.G();var t,n,i,r,o=this.l[0][4],a=this.l[1];t=e.length;var s=1;if(4!==t&&6!==t&&8!==t)throw new u.exception.invalid("invalid aes key size");for(this.b=[i=e.slice(0),r=[]],e=t;4*t+28>e;e++)n=i[e-1],(0===e%t||8===t&&4===e%t)&&(n=o[n>>>24]<<24^o[n>>16&255]<<16^o[n>>8&255]<<8^o[255&n],0===e%t&&(n=n<<8^n>>>24^s<<24,s=s<<1^283*(s>>7))),i[e]=i[e-t]^n;for(t=0;e;t++,e--)n=i[3&t?e:e-4],r[t]=4>=e||4>t?n:a[0][o[n>>>24]]^a[1][o[n>>16&255]]^a[2][o[n>>8&255]]^a[3][o[255&n]]},u.cipher.aes.prototype={encrypt:function(e){return r(this,e,0)},decrypt:function(e){return r(this,e,1)},l:[[[],[],[],[],[]],[[],[],[],[],[]]],G:function(){var e,t,n,i,r,o,a,s=this.l[0],c=this.l[1],l=s[4],d=c[4],u=[],p=[];for(e=0;256>e;e++)p[(u[e]=e<<1^283*(e>>7))^e]=e;for(t=n=0;!l[t];t^=i||1,n=p[n]||1)for(o=n^n<<1^n<<2^n<<3^n<<4,o=o>>8^255&o^99,l[t]=o,d[o]=t,r=u[e=u[i=u[t]]],a=16843009*r^65537*e^257*i^16843008*t,r=257*u[o]^16843008*o,e=0;4>e;e++)s[e][t]=r=r<<24^r>>>8,c[e][o]=a=a<<24^a>>>8;for(e=0;5>e;e++)s[e]=s[e].slice(0),c[e]=c[e].slice(0)}},u.bitArray={bitSlice:function(e,t,n){return e=u.bitArray.M(e.slice(t/32),32-(31&t)).slice(1),void 0===n?e:u.bitArray.clamp(e,n-t)},extract:function(e,t,n){var i=Math.floor(-t-n&31);return(-32&(t+n-1^t)?e[t/32|0]<<32-i^e[t/32+1|0]>>>i:e[t/32|0]>>>i)&(1<<n)-1},concat:function(e,t){if(0===e.length||0===t.length)return e.concat(t);var n=e[e.length-1],i=u.bitArray.getPartial(n);return 32===i?e.concat(t):u.bitArray.M(t,i,0|n,e.slice(0,e.length-1))},bitLength:function(e){var t=e.length;return 0===t?0:32*(t-1)+u.bitArray.getPartial(e[t-1])},clamp:function(e,t){if(32*e.length<t)return e;
e=e.slice(0,Math.ceil(t/32));var n=e.length;return t=31&t,n>0&&t&&(e[n-1]=u.bitArray.partial(t,e[n-1]&2147483648>>t-1,1)),e},partial:function(e,t,n){return 32===e?t:(n?0|t:t<<32-e)+1099511627776*e},getPartial:function(e){return Math.round(e/1099511627776)||32},equal:function(e,t){if(u.bitArray.bitLength(e)!==u.bitArray.bitLength(t))return!1;var n,i=0;for(n=0;n<e.length;n++)i|=e[n]^t[n];return 0===i},M:function(e,t,n,i){var r;for(r=0,void 0===i&&(i=[]);t>=32;t-=32)i.push(n),n=0;if(0===t)return i.concat(e);for(r=0;r<e.length;r++)i.push(n|e[r]>>>t),n=e[r]<<32-t;return r=e.length?e[e.length-1]:0,e=u.bitArray.getPartial(r),i.push(u.bitArray.partial(t+e&31,t+e>32?n:i.pop(),1)),i},Y:function(e,t){return[e[0]^t[0],e[1]^t[1],e[2]^t[2],e[3]^t[3]]},byteswapM:function(e){var t,n;for(t=0;t<e.length;++t)n=e[t],e[t]=n>>>24|n>>>8&65280|(65280&n)<<8|n<<24;return e}},u.codec.utf8String={fromBits:function(e){var t,n,i="",r=u.bitArray.bitLength(e);for(t=0;r/8>t;t++)0===(3&t)&&(n=e[t/4]),i+=String.fromCharCode(n>>>24),n<<=8;return decodeURIComponent(escape(i))},toBits:function(e){e=unescape(encodeURIComponent(e));var t,n=[],i=0;for(t=0;t<e.length;t++)i=i<<8|e.charCodeAt(t),3===(3&t)&&(n.push(i),i=0);return 3&t&&n.push(u.bitArray.partial(8*(3&t),i)),n}},u.codec.hex={fromBits:function(e){var t,n="";for(t=0;t<e.length;t++)n+=((0|e[t])+0xf00000000000).toString(16).substr(4);return n.substr(0,u.bitArray.bitLength(e)/4)},toBits:function(e){var t,n,i=[];for(e=e.replace(/\s|0x/g,""),n=e.length,e+="00000000",t=0;t<e.length;t+=8)i.push(0^parseInt(e.substr(t,8),16));return u.bitArray.clamp(i,4*n)}},u.hash.sha256=function(e){this.b[0]||this.G(),e?(this.u=e.u.slice(0),this.o=e.o.slice(0),this.h=e.h):this.reset()},u.hash.sha256.hash=function(e){return(new u.hash.sha256).update(e).finalize()},u.hash.sha256.prototype={blockSize:512,reset:function(){return this.u=this.K.slice(0),this.o=[],this.h=0,this},update:function(e){"string"==typeof e&&(e=u.codec.utf8String.toBits(e));var t,n=this.o=u.bitArray.concat(this.o,e);if(t=this.h,e=this.h=t+u.bitArray.bitLength(e),e>9007199254740991)throw new u.exception.invalid("Cannot hash more than 2^53 - 1 bits");if("undefined"!=typeof Uint32Array){var i=new Uint32Array(n),r=0;for(t=512+t-(512+t&511);e>=t;t+=512)o(this,i.subarray(16*r,16*(r+1))),r+=1;n.splice(0,16*r)}else for(t=512+t-(512+t&511);e>=t;t+=512)o(this,n.splice(0,16));return this},finalize:function(){var e,t=this.o,n=this.u,t=u.bitArray.concat(t,[u.bitArray.partial(1,1)]);for(e=t.length+2;15&e;e++)t.push(0);for(t.push(Math.floor(this.h/4294967296)),t.push(0|this.h);t.length;)o(this,t.splice(0,16));return this.reset(),n},K:[],b:[],G:function(){function e(e){return 4294967296*(e-Math.floor(e))|0}for(var t,n,i=0,r=2;64>i;r++){for(n=!0,t=2;r>=t*t;t++)if(0===r%t){n=!1;break}n&&(8>i&&(this.K[i]=e(Math.pow(r,.5))),this.b[i]=e(Math.pow(r,1/3)),i++)}}},u.prng=function(e){this.c=[new u.hash.sha256],this.i=[0],this.H=0,this.v={},this.F=0,this.J={},this.L=this.f=this.j=this.T=0,this.b=[0,0,0,0,0,0,0,0],this.g=[0,0,0,0],this.C=void 0,this.D=e,this.s=!1,this.B={progress:{},seeded:{}},this.m=this.S=0,this.w=1,this.A=2,this.O=65536,this.I=[0,48,64,96,128,192,256,384,512,768,1024],this.P=3e4,this.N=80},u.prng.prototype={randomWords:function(e,t){var n,i=[];n=this.isReady(t);var r;if(n===this.m)throw new u.exception.notReady("generator isn't seeded");if(n&this.A){n=!(n&this.w),r=[];var o,a=0;for(this.L=r[0]=(new Date).valueOf()+this.P,o=0;16>o;o++)r.push(4294967296*Math.random()|0);for(o=0;o<this.c.length&&(r=r.concat(this.c[o].finalize()),a+=this.i[o],this.i[o]=0,n||!(this.H&1<<o));o++);for(this.H>=1<<this.c.length&&(this.c.push(new u.hash.sha256),this.i.push(0)),this.f-=a,a>this.j&&(this.j=a),this.H++,this.b=u.hash.sha256.hash(this.b.concat(r)),this.C=new u.cipher.aes(this.b),n=0;4>n&&(this.g[n]=this.g[n]+1|0,!this.g[n]);n++);}for(n=0;e>n;n+=4)0===(n+1)%this.O&&c(this),r=l(this),i.push(r[0],r[1],r[2],r[3]);return c(this),i.slice(0,e)},setDefaultParanoia:function(e,t){if(0===e&&"Setting paranoia=0 will ruin your security; use it only for testing"!==t)throw new u.exception.invalid("Setting paranoia=0 will ruin your security; use it only for testing");this.D=e},addEntropy:function(e,t,n){n=n||"user";var i,r,o=(new Date).valueOf(),s=this.v[n],c=this.isReady(),l=0;switch(i=this.J[n],void 0===i&&(i=this.J[n]=this.T++),void 0===s&&(s=this.v[n]=0),this.v[n]=(this.v[n]+1)%this.c.length,typeof e){case"number":void 0===t&&(t=1),this.c[s].update([i,this.F++,1,t,o,1,0|e]);break;case"object":if(n=Object.prototype.toString.call(e),"[object Uint32Array]"===n){for(r=[],n=0;n<e.length;n++)r.push(e[n]);e=r}else for("[object Array]"!==n&&(l=1),n=0;n<e.length&&!l;n++)"number"!=typeof e[n]&&(l=1);if(!l){if(void 0===t)for(n=t=0;n<e.length;n++)for(r=e[n];r>0;)t++,r>>>=1;this.c[s].update([i,this.F++,2,t,o,e.length].concat(e))}break;case"string":void 0===t&&(t=e.length),this.c[s].update([i,this.F++,3,t,o,e.length]),this.c[s].update(e);break;default:l=1}if(l)throw new u.exception.bug("random: addEntropy only supports number, array of numbers or string");this.i[s]+=t,this.f+=t,c===this.m&&(this.isReady()!==this.m&&a("seeded",Math.max(this.j,this.f)),a("progress",this.getProgress()))},isReady:function(e){return e=this.I[void 0!==e?e:this.D],this.j&&this.j>=e?this.i[0]>this.N&&(new Date).valueOf()>this.L?this.A|this.w:this.w:this.f>=e?this.A|this.m:this.m},getProgress:function(e){return e=this.I[e?e:this.D],this.j>=e?1:this.f>e?1:this.f/e},startCollectors:function(){if(!this.s){if(this.a={loadTimeCollector:d(this,this.V),mouseCollector:d(this,this.W),keyboardCollector:d(this,this.U),accelerometerCollector:d(this,this.R),touchCollector:d(this,this.X)},window.addEventListener)window.addEventListener("load",this.a.loadTimeCollector,!1),window.addEventListener("mousemove",this.a.mouseCollector,!1),window.addEventListener("keypress",this.a.keyboardCollector,!1),window.addEventListener("devicemotion",this.a.accelerometerCollector,!1),window.addEventListener("touchmove",this.a.touchCollector,!1);else{if(!document.attachEvent)throw new u.exception.bug("can't attach event");document.attachEvent("onload",this.a.loadTimeCollector),document.attachEvent("onmousemove",this.a.mouseCollector),document.attachEvent("keypress",this.a.keyboardCollector)}this.s=!0}},stopCollectors:function(){this.s&&(window.removeEventListener?(window.removeEventListener("load",this.a.loadTimeCollector,!1),window.removeEventListener("mousemove",this.a.mouseCollector,!1),window.removeEventListener("keypress",this.a.keyboardCollector,!1),window.removeEventListener("devicemotion",this.a.accelerometerCollector,!1),window.removeEventListener("touchmove",this.a.touchCollector,!1)):document.detachEvent&&(document.detachEvent("onload",this.a.loadTimeCollector),document.detachEvent("onmousemove",this.a.mouseCollector),document.detachEvent("keypress",this.a.keyboardCollector)),this.s=!1)},addEventListener:function(e,t){this.B[e][this.S++]=t},removeEventListener:function(e,t){var n,i,r=this.B[e],o=[];for(i in r)r.hasOwnProperty(i)&&r[i]===t&&o.push(i);for(n=0;n<o.length;n++)i=o[n],delete r[i]},U:function(){s(this,1)},W:function(e){var t,n;try{t=e.x||e.clientX||e.offsetX||0,n=e.y||e.clientY||e.offsetY||0}catch(i){n=t=0}0!=t&&0!=n&&this.addEntropy([t,n],2,"mouse"),s(this,0)},X:function(e){e=e.touches[0]||e.changedTouches[0],this.addEntropy([e.pageX||e.clientX,e.pageY||e.clientY],1,"touch"),s(this,0)},V:function(){s(this,2)},R:function(e){if(e=e.accelerationIncludingGravity.x||e.accelerationIncludingGravity.y||e.accelerationIncludingGravity.z,window.orientation){var t=window.orientation;"number"==typeof t&&this.addEntropy(t,1,"accelerometer")}e&&this.addEntropy(e,2,"accelerometer"),s(this,0)}},u.random=new u.prng(6);e:try{var p,_,f,h;if(h="undefined"!=typeof n&&n.exports){var E;try{E=t("crypto")}catch(I){E=null}h=_=E}if(h&&_.randomBytes)p=_.randomBytes(128),p=new Uint32Array(new Uint8Array(p).buffer),u.random.addEntropy(p,1024,"crypto['randomBytes']");else if("undefined"!=typeof window&&"undefined"!=typeof Uint32Array){if(f=new Uint32Array(32),window.crypto&&window.crypto.getRandomValues)window.crypto.getRandomValues(f);else{if(!window.msCrypto||!window.msCrypto.getRandomValues)break e;window.msCrypto.getRandomValues(f)}u.random.addEntropy(f,1024,"crypto['getRandomValues']")}}catch(I){"undefined"!=typeof window&&window.console&&(console.log("There was an error collecting entropy from the browser:"),console.log(I))}"undefined"!=typeof n&&n.exports&&(n.exports=u),"function"==typeof e&&e([],function(){return u})},{crypto:void 0}],29:[function(e,t,n){"use strict";var i=e("./lib/error");t.exports={CALLBACK_REQUIRED:{type:i.types.MERCHANT,code:"CALLBACK_REQUIRED"},INSTANTIATION_OPTION_REQUIRED:{type:i.types.MERCHANT,code:"INSTANTIATION_OPTION_REQUIRED"},INCOMPATIBLE_VERSIONS:{type:i.types.MERCHANT,code:"INCOMPATIBLE_VERSIONS"},METHOD_CALLED_AFTER_TEARDOWN:{type:i.types.MERCHANT,code:"METHOD_CALLED_AFTER_TEARDOWN"},BRAINTREE_API_ACCESS_RESTRICTED:{type:i.types.MERCHANT,code:"BRAINTREE_API_ACCESS_RESTRICTED",message:"Your access is restricted and cannot use this part of the Braintree API."}}},{"./lib/error":53}],30:[function(e,t,n){"use strict";var i=e("../shared/constants");t.exports=function(e,t){return e+"/web/"+i.VERSION+"/html/hosted-fields-frame.min.html#"+t}},{"../shared/constants":34}],31:[function(e,t,n){"use strict";function i(e){return function(t){var n,i=t.merchantPayload,r=i.emittedBy,o=e[r].containerElement;Object.keys(i.fields).forEach(function(t){i.fields[t].container=e[t].containerElement}),n=i.fields[r],a.toggle(o,u.externalClasses.FOCUSED,n.isFocused),a.toggle(o,u.externalClasses.VALID,n.isValid),a.toggle(o,u.externalClasses.INVALID,!n.isPotentiallyValid),this._state={cards:i.cards,fields:i.fields},this._emit(t.type,i)}}function r(e){var t,n,h=this,E={},I=0,T=f();if(!e.client)throw new l({type:v.INSTANTIATION_OPTION_REQUIRED.type,code:v.INSTANTIATION_OPTION_REQUIRED.code,message:"options.client is required when instantiating Hosted Fields."});if(n=e.client.getConfiguration().analyticsMetadata.sdkVersion,n!==O)throw new l({type:v.INCOMPATIBLE_VERSIONS.type,code:v.INCOMPATIBLE_VERSIONS.code,message:"Client (version "+n+") and Hosted Fields (version "+O+") components must be from the same SDK version."});if(!e.fields)throw new l({type:v.INSTANTIATION_OPTION_REQUIRED.type,code:v.INSTANTIATION_OPTION_REQUIRED.code,message:"options.fields is required when instantiating Hosted Fields."});m.call(this),this._injectedNodes=[],this._destructor=new o,this._fields=E,this._state={fields:{},cards:D("")},this._bus=new c({channel:T,merchantUrl:location.href}),this._destructor.registerFunctionForTeardown(function(){h._bus.teardown()}),this._client=e.client,N.sendEvent(this._client,"web.custom.hosted-fields.initialized"),Object.keys(e.fields).forEach(function(t){var n,i,r;if(!u.whitelistedFields.hasOwnProperty(t))throw new l({type:p.HOSTED_FIELDS_INVALID_FIELD_KEY.type,code:p.HOSTED_FIELDS_INVALID_FIELD_KEY.code,message:'"'+t+'" is not a valid field.'});if(n=e.fields[t],i=document.querySelector(n.selector),!i)throw new l({type:p.HOSTED_FIELDS_INVALID_FIELD_SELECTOR.type,code:p.HOSTED_FIELDS_INVALID_FIELD_SELECTOR.code,message:p.HOSTED_FIELDS_INVALID_FIELD_SELECTOR.message,details:{fieldSelector:n.selector,fieldKey:t}});if(i.querySelector('iframe[name^="braintree-"]'))throw new l({type:p.HOSTED_FIELDS_FIELD_DUPLICATE_IFRAME.type,code:p.HOSTED_FIELDS_FIELD_DUPLICATE_IFRAME.code,message:p.HOSTED_FIELDS_FIELD_DUPLICATE_IFRAME.message,details:{fieldSelector:n.selector,fieldKey:t}});r=s({type:t,name:"braintree-hosted-field-"+t,style:u.defaultIFrameStyle}),this._injectedNodes=this._injectedNodes.concat(A(r,i)),this._setupLabelFocus(t,i),E[t]={frameElement:r,containerElement:i},I++,this._state.fields[t]={isEmpty:!0,isValid:!1,isPotentiallyValid:!0,isFocused:!1,container:i},setTimeout(function(){r.src=d(h._client.getConfiguration().gatewayConfiguration.assetsUrl,T)},0)}.bind(this)),t=setTimeout(function(){N.sendEvent(h._client,"web.custom.hosted-fields.load.timed-out")},_),this._bus.on(y.FRAME_READY,function(n){I--,0===I&&(clearTimeout(t),n(e),h._emit("ready"))}),this._bus.on(y.INPUT_EVENT,i(E).bind(this)),this._destructor.registerFunctionForTeardown(function(){var e,t,n;for(e=0;e<h._injectedNodes.length;e++)t=h._injectedNodes[e],n=t.parentNode,n.removeChild(t),a.remove(n,u.externalClasses.FOCUSED,u.externalClasses.INVALID,u.externalClasses.VALID)}),this._destructor.registerFunctionForTeardown(function(){var e=b(r.prototype).concat(b(m.prototype));g(h,e)})}var o=e("../../lib/destructor"),a=e("../../lib/classlist"),s=e("iframer"),c=e("../../lib/bus"),l=e("../../lib/error"),d=e("./compose-url"),u=e("../shared/constants"),p=e("../shared/errors"),_=e("../../lib/constants").INTEGRATION_TIMEOUT_MS,f=e("../../lib/uuid"),h=e("../shared/find-parent-tags"),E=e("../../lib/throw-if-no-callback"),I=e("../../lib/is-ios"),y=u.events,m=e("../../lib/event-emitter"),A=e("./inject-frame"),N=e("../../lib/analytics"),T=u.whitelistedFields,O="3.5.0",b=e("../../lib/methods"),g=e("../../lib/convert-methods-to-error"),R=e("../../lib/deferred"),v=e("../../errors"),D=e("credit-card-type");r.prototype=Object.create(m.prototype,{constructor:r}),r.prototype._setupLabelFocus=function(e,t){function n(){a.emit(y.TRIGGER_INPUT_FOCUS,e)}var i,r,o=I(),a=this._bus;if(!o&&null!=t.id){for(i=Array.prototype.slice.call(document.querySelectorAll('label[for="'+t.id+'"]')),i=i.concat(h(t,"label")),r=0;r<i.length;r++)i[r].addEventListener("click",n,!1);this._destructor.registerFunctionForTeardown(function(){for(r=0;r<i.length;r++)i[r].removeEventListener("click",n,!1)})}},r.prototype.teardown=function(e){var t=this._client;this._destructor.teardown(function(n){N.sendEvent(t,"web.custom.hosted-fields.teardown-completed"),"function"==typeof e&&(e=R(e))(n)})},r.prototype.tokenize=function(e,t){t||(t=e,e={}),E(t,"tokenize"),this._bus.emit(y.TOKENIZATION_REQUEST,e,function(e){t.apply(null,e)})},r.prototype.addClass=function(e,t,n){var i;T.hasOwnProperty(e)?this._fields.hasOwnProperty(e)?this._bus.emit(y.ADD_CLASS,e,t):i=new l({type:p.HOSTED_FIELDS_FIELD_NOT_PRESENT.type,code:p.HOSTED_FIELDS_FIELD_NOT_PRESENT.code,message:'Cannot add class to "'+e+'" field because it is not part of the current Hosted Fields options.'}):i=new l({type:p.HOSTED_FIELDS_FIELD_INVALID.type,code:p.HOSTED_FIELDS_FIELD_INVALID.code,message:'"'+e+'" is not a valid field. You must use a valid field option when adding a class.'}),"function"==typeof n&&(n=R(n))(i)},r.prototype.removeClass=function(e,t,n){var i;T.hasOwnProperty(e)?this._fields.hasOwnProperty(e)?this._bus.emit(y.REMOVE_CLASS,e,t):i=new l({type:p.HOSTED_FIELDS_FIELD_NOT_PRESENT.type,code:p.HOSTED_FIELDS_FIELD_NOT_PRESENT.code,message:'Cannot remove class from "'+e+'" field because it is not part of the current Hosted Fields options.'}):i=new l({type:p.HOSTED_FIELDS_FIELD_INVALID.type,code:p.HOSTED_FIELDS_FIELD_INVALID.code,message:'"'+e+'" is not a valid field. You must use a valid field option when removing a class.'}),"function"==typeof n&&(n=R(n))(i)},r.prototype.setPlaceholder=function(e,t,n){var i;T.hasOwnProperty(e)?this._fields.hasOwnProperty(e)?this._bus.emit(y.SET_PLACEHOLDER,e,t):i=new l({type:p.HOSTED_FIELDS_FIELD_NOT_PRESENT.type,code:p.HOSTED_FIELDS_FIELD_NOT_PRESENT.code,message:'Cannot set placeholder for "'+e+'" field because it is not part of the current Hosted Fields options.'}):i=new l({type:p.HOSTED_FIELDS_FIELD_INVALID.type,code:p.HOSTED_FIELDS_FIELD_INVALID.code,message:'"'+e+'" is not a valid field. You must use a valid field option when setting a placeholder.'}),"function"==typeof n&&(n=R(n))(i)},r.prototype.clear=function(e,t){var n;T.hasOwnProperty(e)?this._fields.hasOwnProperty(e)?this._bus.emit(y.CLEAR_FIELD,e):n=new l({type:p.HOSTED_FIELDS_FIELD_NOT_PRESENT.type,code:p.HOSTED_FIELDS_FIELD_NOT_PRESENT.code,message:'Cannot clear "'+e+'" field because it is not part of the current Hosted Fields options.'}):n=new l({type:p.HOSTED_FIELDS_FIELD_INVALID.type,code:p.HOSTED_FIELDS_FIELD_INVALID.code,message:'"'+e+'" is not a valid field. You must use a valid field option when clearing a field.'}),"function"==typeof t&&(t=R(t))(n)},r.prototype.getState=function(){return this._state},t.exports=r},{"../../errors":29,"../../lib/analytics":39,"../../lib/bus":44,"../../lib/classlist":46,"../../lib/constants":47,"../../lib/convert-methods-to-error":48,"../../lib/deferred":50,"../../lib/destructor":51,"../../lib/error":53,"../../lib/event-emitter":54,"../../lib/is-ios":64,"../../lib/methods":67,"../../lib/throw-if-no-callback":71,"../../lib/uuid":72,"../shared/constants":34,"../shared/errors":35,"../shared/find-parent-tags":36,"./compose-url":30,"./inject-frame":32,"credit-card-type":1,iframer:3}],32:[function(e,t,n){"use strict";t.exports=function(e,t){var n=document.createElement("div"),i=document.createDocumentFragment();return n.style.clear="both",i.appendChild(e),i.appendChild(n),t.appendChild(i),[e,n]}},{}],33:[function(e,t,n){"use strict";function i(e,t){var n;a(t,"create");try{n=new r(e)}catch(i){return t=o(t),void t(i)}n.on("ready",function(){t(null,n)})}var r=e("./external/hosted-fields"),o=e("../lib/deferred"),a=e("../lib/throw-if-no-callback"),s="3.5.0";t.exports={create:i,VERSION:s}},{"../lib/deferred":50,"../lib/throw-if-no-callback":71,"./external/hosted-fields":31}],34:[function(e,t,n){"use strict";var i=e("../../lib/enumerate"),r="3.5.0",o={VERSION:r,maxExpirationYearAge:19,externalEvents:{FOCUS:"focus",BLUR:"blur",EMPTY:"empty",NOT_EMPTY:"notEmpty",VALIDITY_CHANGE:"validityChange",CARD_TYPE_CHANGE:"cardTypeChange"},defaultMaxLengths:{number:19,postalCode:8,expirationDate:7,expirationMonth:2,expirationYear:4,cvv:3},externalClasses:{FOCUSED:"braintree-hosted-fields-focused",INVALID:"braintree-hosted-fields-invalid",VALID:"braintree-hosted-fields-valid"},defaultIFrameStyle:{border:"none",width:"100%",height:"100%","float":"left"},whitelistedStyles:["-moz-osx-font-smoothing","-moz-tap-highlight-color","-moz-transition","-webkit-font-smoothing","-webkit-tap-highlight-color","-webkit-transition","color","font","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-variant-alternates","font-variant-caps","font-variant-east-asian","font-variant-ligatures","font-variant-numeric","font-weight","line-height","opacity","outline","text-shadow","transition"],whitelistedFields:{number:{name:"credit-card-number",label:"Credit Card Number"},cvv:{name:"cvv",label:"CVV"},expirationDate:{name:"expiration",label:"Expiration Date"},expirationMonth:{name:"expiration-month",label:"Expiration Month"},expirationYear:{name:"expiration-year",label:"Expiration Year"},postalCode:{name:"postal-code",label:"Postal Code"}}};o.events=i(["FRAME_READY","VALIDATE_STRICT","CONFIGURATION","TOKENIZATION_REQUEST","INPUT_EVENT","TRIGGER_INPUT_FOCUS","ADD_CLASS","REMOVE_CLASS","SET_PLACEHOLDER","CLEAR_FIELD"],"hosted-fields:"),t.exports=o},{"../../lib/enumerate":52}],35:[function(e,t,n){"use strict";var i=e("../../lib/error");t.exports={HOSTED_FIELDS_INVALID_FIELD_KEY:{type:i.types.MERCHANT,code:"HOSTED_FIELDS_INVALID_FIELD_KEY"},HOSTED_FIELDS_INVALID_FIELD_SELECTOR:{type:i.types.MERCHANT,code:"HOSTED_FIELDS_INVALID_FIELD_SELECTOR",message:"Selector does not reference a valid DOM node."},HOSTED_FIELDS_FIELD_DUPLICATE_IFRAME:{type:i.types.MERCHANT,code:"HOSTED_FIELDS_FIELD_DUPLICATE_IFRAME",message:"Element already contains a Braintree iframe."},HOSTED_FIELDS_FIELD_INVALID:{type:i.types.MERCHANT,code:"HOSTED_FIELDS_FIELD_INVALID"},HOSTED_FIELDS_FIELD_NOT_PRESENT:{type:i.types.MERCHANT,code:"HOSTED_FIELDS_FIELD_NOT_PRESENT"},HOSTED_FIELDS_TOKENIZATION_NETWORK_ERROR:{type:i.types.NETWORK,code:"HOSTED_FIELDS_TOKENIZATION_NETWORK_ERROR",message:"A tokenization network error occurred."},HOSTED_FIELDS_FAILED_TOKENIZATION:{type:i.types.CUSTOMER,code:"HOSTED_FIELDS_FAILED_TOKENIZATION",message:"The supplied card data failed tokenization."},HOSTED_FIELDS_FIELDS_EMPTY:{type:i.types.CUSTOMER,code:"HOSTED_FIELDS_FIELDS_EMPTY",message:"All fields are empty. Cannot tokenize empty card fields."},HOSTED_FIELDS_FIELDS_INVALID:{type:i.types.CUSTOMER,code:"HOSTED_FIELDS_FIELDS_INVALID",message:"Some payment input fields are invalid. Cannot tokenize invalid card fields."}}},{"../../lib/error":53}],36:[function(e,t,n){"use strict";function i(e,t){for(var n=e.parentNode,i=[];null!=n;)null!=n.tagName&&n.tagName.toLowerCase()===t&&i.push(n),n=n.parentNode;return i}t.exports=i},{}],37:[function(e,t,n){"use strict";var i=e("./client"),r=e("./paypal"),o=e("./hosted-fields"),a=e("./data-collector"),s=e("./american-express"),c=e("./unionpay"),l=e("./apple-pay"),d=e("./three-d-secure"),u=e("./us-bank-account"),p="3.5.0";t.exports={client:i,paypal:r,hostedFields:o,threeDSecure:d,dataCollector:a,americanExpress:s,unionpay:c,applePay:l,usBankAccount:u,VERSION:p}},{"./american-express":9,"./apple-pay":12,"./client":16,"./data-collector":26,"./hosted-fields":33,"./paypal":74,"./three-d-secure":78,"./unionpay":82,"./us-bank-account":88}],38:[function(e,t,n){"use strict";function i(e,t){var n,i=t?o(t):{},s=r(e.authorization).attrs,c=o(e.analyticsMetadata);i.braintreeLibraryVersion=a.BRAINTREE_LIBRARY_VERSION;for(n in i._meta)i._meta.hasOwnProperty(n)&&(c[n]=i._meta[n]);return i._meta=c,s.tokenizationKey?i.tokenizationKey=s.tokenizationKey:i.authorizationFingerprint=s.authorizationFingerprint,i}var r=e("./create-authorization-data"),o=e("./json-clone"),a=e("./constants");t.exports=i},{"./constants":47,"./create-authorization-data":49,"./json-clone":66}],39:[function(e,t,n){"use strict";function i(e){return Math.floor(e/1e3)}function r(e,t,n){var r=e.getConfiguration(),s=e._request,c=i(Date.now()),l=r.gatewayConfiguration.analytics.url,d={analytics:[{kind:t,timestamp:c}]};s({url:l,method:"post",data:a(r,d),timeout:o.ANALYTICS_REQUEST_TIMEOUT_MS},n)}var o=e("./constants"),a=e("./add-metadata");t.exports={sendEvent:r}},{"./add-metadata":38,"./constants":47}],40:[function(e,t,n){"use strict";function i(e,t){var n=0===e.length;n?(e(),t(null)):e(t)}var r=e("./once");t.exports=function(e,t){function n(e){return e?void c(e):(s-=1,void(0===s&&c(null)))}var o,a=e.length,s=a,c=r(t);if(0===a)return void c(null);for(o=0;a>o;o++)i(e[o],n)}},{"./once":68}],41:[function(e,t,n){(function(e){"use strict";function n(t){return t=t||e.navigator.userAgent,t.indexOf("Opera Mini")>-1}function i(t){return t=t||e.navigator.userAgent,s(t)&&t.indexOf("Firefox")>-1}function r(t){return t=t||e.navigator.userAgent,-1!==t.indexOf("MSIE")?parseInt(t.replace(/.*MSIE ([0-9]+)\..*/,"$1"),10):/Trident.*rv:11/.test(t)?11:null}function o(t){return t=t||e.location.protocol,"https:"===t}function a(t){return t=t||e.navigator.userAgent,/iPhone|iPod|iPad/.test(t)}function s(t){return t=t||e.navigator.userAgent,/Android/.test(t)}function c(t){return t=t||e.navigator.userAgent,!(d(t)||u(t)||n(t))}function l(e){return/\bGSA\b/.test(e)}function d(t){return t=t||e.navigator.userAgent,a(t)?l(t)?!0:/.+AppleWebKit(?!.*Safari)/.test(t):!1}function u(t){var i=/Version\/[\d\.]+/;return t=t||e.navigator.userAgent,s(t)?i.test(t)&&!n(t):!1}t.exports={isOperaMini:n,isAndroidFirefox:i,getIEVersion:r,isHTTPS:o,isIos:a,isAndroid:s,supportsPopups:c}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],42:[function(e,t,n){"use strict";function i(e,t){var n,i,o=document.createElement("a");return o.href=t,i="https:"===o.protocol?o.host.replace(/:443$/,""):"http:"===o.protocol?o.host.replace(/:80$/,""):o.host,n=o.protocol+"//"+i,n===e?!0:(o.href=e,r(e))}var r=e("../is-whitelisted-domain");t.exports={checkOrigin:i}},{"../is-whitelisted-domain":65}],43:[function(e,t,n){"use strict";var i=e("../enumerate");t.exports=i(["CONFIGURATION_REQUEST"],"bus:")},{"../enumerate":52}],44:[function(e,t,n){"use strict";function i(e){if(e=e||{},this.channel=e.channel,!this.channel)throw new s({type:s.types.INTERNAL,code:"MISSING_CHANNEL_ID",message:"Channel ID must be specified."});this.merchantUrl=e.merchantUrl,this._isDestroyed=!1,this._isVerbose=!1,this._listeners=[],this._log("new bus on channel "+this.channel,[location.href])}var r=e("framebus"),o=e("./events"),a=e("./check-origin").checkOrigin,s=e("../error");i.prototype.on=function(e,t){var n,i,o=t,s=this;this._isDestroyed||(this.merchantUrl&&(o=function(){a(this.origin,s.merchantUrl)&&t.apply(this,arguments)}),n=this._namespaceEvent(e),i=Array.prototype.slice.call(arguments),i[0]=n,i[1]=o,this._log("on",i),r.on.apply(r,i),this._listeners.push({eventName:e,handler:o,originalHandler:t}))},i.prototype.emit=function(e){var t;this._isDestroyed||(t=Array.prototype.slice.call(arguments),t[0]=this._namespaceEvent(e),this._log("emit",t),r.emit.apply(r,t))},i.prototype._offDirect=function(e){var t=Array.prototype.slice.call(arguments);this._isDestroyed||(t[0]=this._namespaceEvent(e),this._log("off",t),r.off.apply(r,t))},i.prototype.off=function(e,t){var n,i,r=t;if(!this._isDestroyed){if(this.merchantUrl)for(n=0;n<this._listeners.length;n++)i=this._listeners[n],i.originalHandler===t&&(r=i.handler);this._offDirect(e,r)}},i.prototype._namespaceEvent=function(e){return["braintree",this.channel,e].join(":")},i.prototype.teardown=function(){var e,t;for(t=0;t<this._listeners.length;t++)e=this._listeners[t],this._offDirect(e.eventName,e.handler);this._listeners.length=0,this._isDestroyed=!0},i.prototype._log=function(e,t){this._isVerbose&&console.log(e,t)},i.events=o,t.exports=i},{"../error":53,"./check-origin":42,"./events":43,framebus:2}],45:[function(e,t,n){"use strict";function i(e){return e.replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/([A-Z]+)([A-Z][a-z\d]+)/g,"$1_$2").toLowerCase()}t.exports=function(e){return Object.keys(e).reduce(function(t,n){var r=i(n);return t[r]=e[n],t},{})}},{}],46:[function(e,t,n){"use strict";function i(e){return e.className.trim().split(/\s+/)}function r(e){var t=Array.prototype.slice.call(arguments,1),n=i(e).filter(function(e){return-1===t.indexOf(e)}).concat(t).join(" ");e.className=n}function o(e){var t=Array.prototype.slice.call(arguments,1),n=i(e).filter(function(e){return-1===t.indexOf(e)}).join(" ");e.className=n}function a(e,t,n){n?r(e,t):o(e,t)}t.exports={add:r,remove:o,toggle:a}},{}],47:[function(e,t,n){"use strict";var i="3.5.0",r="web";t.exports={ANALYTICS_REQUEST_TIMEOUT_MS:2e3,INTEGRATION_TIMEOUT_MS:6e4,VERSION:i,INTEGRATION:"custom",SOURCE:"client",PLATFORM:r,BRAINTREE_LIBRARY_VERSION:"braintree/"+r+"/"+i}},{}],48:[function(e,t,n){"use strict";var i=e("./error"),r=e("../errors");t.exports=function(e,t){t.forEach(function(t){e[t]=function(){throw new i({type:r.METHOD_CALLED_AFTER_TEARDOWN.type,code:r.METHOD_CALLED_AFTER_TEARDOWN.code,message:t+" cannot be called after teardown."})}})}},{"../errors":29,"./error":53}],49:[function(e,t,n){"use strict";function i(e){return/^[a-zA-Z0-9]+_[a-zA-Z0-9]+_[a-zA-Z0-9_]+$/.test(e)}function r(e){var t=e.split("_"),n=t[0],i=t.slice(2).join("_");return{merchantId:i,environment:n}}function o(e){var t,n,o={attrs:{},configUrl:""};return i(e)?(n=r(e),o.attrs.tokenizationKey=e,o.configUrl=s[n.environment]+"/merchants/"+n.merchantId+"/client_api/v1/configuration"):(t=JSON.parse(a(e)),o.attrs.authorizationFingerprint=t.authorizationFingerprint,o.configUrl=t.configUrl),o}var a=e("../lib/polyfill").atob,s={production:"https://api.braintreegateway.com:443",sandbox:"https://api.sandbox.braintreegateway.com:443"};t.exports=o},{"../lib/polyfill":69}],50:[function(e,t,n){"use strict";t.exports=function(e){return function(){var t=arguments;setTimeout(function(){e.apply(null,t)},1)}}},{}],51:[function(e,t,n){"use strict";function i(){this._teardownRegistry=[],this._isTearingDown=!1}var r=e("./batch-execute-functions");i.prototype.registerFunctionForTeardown=function(e){"function"==typeof e&&this._teardownRegistry.push(e)},i.prototype.teardown=function(e){return this._isTearingDown?void e(new Error("Destructor is already tearing down")):(this._isTearingDown=!0,void r(this._teardownRegistry,function(t){this._teardownRegistry=[],this._isTearingDown=!1,"function"==typeof e&&e(t)}.bind(this)))},t.exports=i},{"./batch-execute-functions":40}],52:[function(e,t,n){"use strict";function i(e,t){return t=null==t?"":t,e.reduce(function(e,n){return e[n]=t+n,e},{})}t.exports=i},{}],53:[function(e,t,n){"use strict";function i(e){if(!i.types.hasOwnProperty(e.type))throw new Error(e.type+" is not a valid type.");if(!e.code)throw new Error("Error code required.");if(!e.message)throw new Error("Error message required.");this.name="BraintreeError",this.code=e.code,this.message=e.message,this.type=e.type,this.details=e.details}var r=e("./enumerate");i.prototype=Object.create(Error.prototype),i.prototype.constructor=i,i.types=r(["CUSTOMER","MERCHANT","NETWORK","INTERNAL","UNKNOWN"]),t.exports=i},{"./enumerate":52}],54:[function(e,t,n){"use strict";function i(){this._events={}}i.prototype.on=function(e,t){this._events[e]?this._events[e].push(t):this._events[e]=[t]},i.prototype._emit=function(e){var t,n,i=this._events[e];if(i)for(n=Array.prototype.slice.call(arguments,1),t=0;t<i.length;t++)i[t].apply(null,n)},t.exports=i},{}],55:[function(e,t,n){"use strict";function i(e){if(!e)throw new Error("Valid configuration is required");if(_.forEach(function(t){if(!e.hasOwnProperty(t))throw new Error("A valid frame "+t+" must be provided")}),!/^[\w_]+$/.test(e.name))throw new Error("A valid frame name must be provided")}function r(e){i(e),this._serviceId=d().replace(/-/g,""),this._options={name:e.name+"_"+this._serviceId,dispatchFrameUrl:e.dispatchFrameUrl,openFrameUrl:e.openFrameUrl},this._state=e.state,this._bus=new a({channel:this._serviceId}),this._setBusEvents()}var o=e("./popup"),a=e("../../bus"),s=e("../shared/events"),c=e("../shared/errors"),l=e("../shared/constants"),d=e("../../uuid"),u=e("iframer"),p=e("../../error"),_=["name","dispatchFrameUrl","openFrameUrl"];r.prototype.initialize=function(e){var t=function(){e(),this._bus.off(s.DISPATCH_FRAME_READY,t)}.bind(this);this._bus.on(s.DISPATCH_FRAME_READY,t),this._writeDispatchFrame()},r.prototype._writeDispatchFrame=function(){var e=l.DISPATCH_FRAME_NAME+"_"+this._serviceId,t=this._options.dispatchFrameUrl;this._dispatchFrame=u({name:e,src:t,"class":l.DISPATCH_FRAME_CLASS,height:0,width:0,style:{position:"absolute",left:"-9999px"}}),document.body.appendChild(this._dispatchFrame)},r.prototype._setBusEvents=function(){this._bus.on(s.DISPATCH_FRAME_REPORT,function(e){this.close(),this._onCompleteCallback&&this._onCompleteCallback.call(null,e.err,e.payload),this._onCompleteCallback=null}.bind(this)),this._bus.on(a.events.CONFIGURATION_REQUEST,function(e){e(this._state)}.bind(this))},r.prototype.open=function(e){this._onCompleteCallback=e,this._frame=o.open(this._options),this._pollForPopupClose()},r.prototype.redirect=function(e){this._frame&&!this.isFrameClosed()&&(this._frame.location.href=e)},r.prototype.close=function(){this.isFrameClosed()||this._frame.close()},r.prototype.focus=function(){this.isFrameClosed()||this._frame.focus()},r.prototype.teardown=function(){this.close(),this._dispatchFrame.parentNode.removeChild(this._dispatchFrame),this._dispatchFrame=null,this._cleanupFrame()},r.prototype.isFrameClosed=function(){return null==this._frame||this._frame.closed},r.prototype._cleanupFrame=function(){this._frame=null,clearInterval(this._popupInterval),this._popupInterval=null},r.prototype._pollForPopupClose=function(){return this._popupInterval=setInterval(function(){this.isFrameClosed()&&(this._cleanupFrame(),this._onCompleteCallback&&this._onCompleteCallback(new p(c.FRAME_SERVICE_FRAME_CLOSED)))}.bind(this),l.POPUP_POLL_INTERVAL),this._popupInterval},t.exports=r},{"../../bus":44,"../../error":53,"../../uuid":72,"../shared/constants":61,"../shared/errors":62,"../shared/events":63,"./popup":58,iframer:3}],56:[function(e,t,n){"use strict";var i=e("./frame-service");t.exports={create:function(e,t){var n=new i(e);n.initialize(function(){t(n)});
}}},{"./frame-service":55}],57:[function(e,t,n){"use strict";var i=e("../../shared/constants"),r=e("./position");t.exports=function(){return[i.POPUP_BASE_OPTIONS,"top="+r.top(),"left="+r.left()].join(",")}},{"../../shared/constants":61,"./position":60}],58:[function(e,t,n){"use strict";t.exports={open:e("./open")}},{"./open":59}],59:[function(e,t,n){(function(n){"use strict";var i=e("./compose-options");t.exports=function(e){return n.open(e.openFrameUrl,e.name,i())}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./compose-options":57}],60:[function(e,t,n){(function(n){"use strict";function i(){var e=n.outerHeight||document.documentElement.clientHeight,t=null==n.screenY?n.screenTop:n.screenY;return o(e,a.POPUP_HEIGHT,t)}function r(){var e=n.outerWidth||document.documentElement.clientWidth,t=null==n.screenX?n.screenLeft:n.screenX;return o(e,a.POPUP_WIDTH,t)}function o(e,t,n){return(e-t)/2+n}var a=e("../../shared/constants");t.exports={top:i,left:r,center:o}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../../shared/constants":61}],61:[function(e,t,n){"use strict";var i=535,r=450;t.exports={DISPATCH_FRAME_NAME:"dispatch",DISPATCH_FRAME_CLASS:"braintree-dispatch-frame",POPUP_BASE_OPTIONS:"resizable,scrollbars,height="+i+",width="+r,POPUP_WIDTH:r,POPUP_HEIGHT:i,POPUP_POLL_INTERVAL:100,POPUP_CLOSE_TIMEOUT:100}},{}],62:[function(e,t,n){"use strict";var i=e("../../error");t.exports={FRAME_SERVICE_FRAME_CLOSED:{type:i.types.INTERNAL,code:"FRAME_SERVICE_FRAME_CLOSED",message:"Frame closed before tokenization could occur."}}},{"../../error":53}],63:[function(e,t,n){"use strict";var i=e("../../enumerate");t.exports=i(["DISPATCH_FRAME_READY","DISPATCH_FRAME_REPORT"],"frameService:")},{"../../enumerate":52}],64:[function(e,t,n){"use strict";t.exports=function(e){return e=e||navigator.userAgent,/(iPad|iPhone|iPod)/i.test(e)}},{}],65:[function(e,t,n){"use strict";function i(e){return e.split(".").slice(-2).join(".")}function r(e){var t;return e=e.toLowerCase(),/^https:/.test(e)?(o=o||document.createElement("a"),o.href=e,t=i(o.hostname),a.hasOwnProperty(t)):!1}var o,a={"paypal.com":1,"braintreepayments.com":1,"braintreegateway.com":1};t.exports=r},{}],66:[function(e,t,n){"use strict";t.exports=function(e){return JSON.parse(JSON.stringify(e))}},{}],67:[function(e,t,n){"use strict";t.exports=function(e){return Object.keys(e).filter(function(t){return"function"==typeof e[t]})}},{}],68:[function(e,t,n){"use strict";function i(e){var t=!1;return function(){t||(t=!0,e.apply(null,arguments))}}t.exports=i},{}],69:[function(e,t,n){(function(e){"use strict";function n(e){var t,n,i,r,o,a,s,c,l=new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})([=]{1,2})?$"),d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",u="";if(!l.test(e))throw new Error("Non base64 encoded input passed to window.atob polyfill");c=0;do r=d.indexOf(e.charAt(c++)),o=d.indexOf(e.charAt(c++)),a=d.indexOf(e.charAt(c++)),s=d.indexOf(e.charAt(c++)),t=(63&r)<<2|o>>4&3,n=(15&o)<<4|a>>2&15,i=(3&a)<<6|63&s,u+=String.fromCharCode(t)+(n?String.fromCharCode(n):"")+(i?String.fromCharCode(i):"");while(c<e.length);return u}var i="function"==typeof e.atob?e.atob:n;t.exports={atob:i,_atob:n}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],70:[function(e,t,n){(function(e){"use strict";function n(e){var t;for(t in e)if(e.hasOwnProperty(t))return!0;return!1}function i(e){return e&&"object"==typeof e&&"number"==typeof e.length&&"[object Array]"===Object.prototype.toString.call(e)||!1}function r(t){var n,i;return t=t||e.location.href,/\?/.test(t)?(n=t.replace(/#.*$/,"").replace(/^.*\?/,"").split("&"),i=n.reduce(function(e,t){var n=t.split("="),i=decodeURIComponent(n[0]),r=decodeURIComponent(n[1]);return e[i]=r,e},{})):{}}function o(e,t){var n,r,a,s=[];for(a in e)e.hasOwnProperty(a)&&(r=e[a],n=t?i(e)?t+"[]":t+"["+a+"]":a,"object"==typeof r?s.push(o(r,n)):s.push(encodeURIComponent(n)+"="+encodeURIComponent(r)));return s.join("&")}function a(e,t){return e=e||"",null!=t&&"object"==typeof t&&n(t)&&(e+=-1===e.indexOf("?")?"?":"",e+=-1!==e.indexOf("=")?"&":"",e+=o(t)),e}t.exports={parse:r,stringify:o,queryify:a}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],71:[function(e,t,n){"use strict";var i=e("./error"),r=e("../errors");t.exports=function(e,t){if("function"!=typeof e)throw new i({type:r.CALLBACK_REQUIRED.type,code:r.CALLBACK_REQUIRED.code,message:t+" must include a callback function."})}},{"../errors":29,"./error":53}],72:[function(e,t,n){"use strict";function i(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0,n="x"===e?t:3&t|8;return n.toString(16)})}t.exports=i},{}],73:[function(e,t,n){"use strict";function i(e){this._client=e.client,this._assetsUrl=e.client.getConfiguration().gatewayConfiguration.paypal.assetsUrl+"/web/"+s,this._authorizationInProgress=!1}var r=e("../../lib/frame-service/external"),o=e("../../lib/error"),a=e("../../lib/once"),s="3.5.0",c=e("../shared/constants"),l=e("../../lib/constants").INTEGRATION_TIMEOUT_MS,d=e("../../lib/analytics"),u=e("../../lib/throw-if-no-callback"),p=e("../../lib/methods"),_=e("../../lib/deferred"),f=e("../shared/errors"),h=e("../../lib/convert-methods-to-error"),E=e("../../lib/querystring");i.prototype._initialize=function(e){var t=this._client,n=setTimeout(function(){d.sendEvent(t,"web.paypal.load.timed-out")},l);r.create({name:c.LANDING_FRAME_NAME,dispatchFrameUrl:this._assetsUrl+"/html/dispatch-frame.min.html",openFrameUrl:this._assetsUrl+"/html/paypal-landing-frame.min.html"},function(i){this._frameService=i,clearTimeout(n),d.sendEvent(t,"web.paypal.load.succeeded"),e()}.bind(this))},i.prototype.tokenize=function(e,t){var n=this._client;return u(t,"tokenize"),t=a(_(t)),this._authorizationInProgress?(d.sendEvent(n,"web.paypal.tokenization.error.already-opened"),t(new o(f.PAYPAL_TOKENIZATION_REQUEST_ACTIVE))):(this._authorizationInProgress=!0,d.sendEvent(n,"web.paypal.tokenization.opened"),this._navigateFrameToAuth(e,t),this._frameService.open(this._createFrameServiceCallback(e,t))),{close:function(){d.sendEvent(n,"web.paypal.tokenization.closed.by-merchant"),this._frameService.close()}.bind(this),focus:function(){this._frameService.focus()}.bind(this)}},i.prototype._createFrameServiceCallback=function(e,t){var n=this._client;return function(i,r){this._authorizationInProgress=!1,i?("FRAME_SERVICE_FRAME_CLOSED"===i.code&&d.sendEvent(n,"web.paypal.tokenization.closed.by-user"),t(new o(f.PAYPAL_POPUP_CLOSED))):this._tokenizePayPal(e,r,t)}.bind(this)},i.prototype._tokenizePayPal=function(e,t,n){var i=this._client;i.request({endpoint:"payment_methods/paypal_accounts",method:"post",data:this._formatTokenizeData(e,t)},function(e,t){e?(d.sendEvent(i,"web.paypal.tokenization.failed"),n(e instanceof o?e:new o({type:f.PAYPAL_ACCOUNT_TOKENIZATION_FAILED.type,code:f.PAYPAL_ACCOUNT_TOKENIZATION_FAILED.code,message:f.PAYPAL_ACCOUNT_TOKENIZATION_FAILED.message,details:{originalError:e}}))):(d.sendEvent(i,"web.paypal.tokenization.success"),n(null,this._formatTokenizePayload(t)))}.bind(this))},i.prototype._formatTokenizePayload=function(e){var t,n={};return e.paypalAccounts&&(n=e.paypalAccounts[0]),t={nonce:n.nonce,details:{},type:n.type},n.details&&n.details.payerInfo&&(t.details=n.details.payerInfo),t},i.prototype._formatTokenizeData=function(e,t){var n=this._client.getConfiguration(),i=n.gatewayConfiguration,r="TOKENIZATION_KEY"===n.authorizationType,o={paypalAccount:{correlationId:this._frameService._serviceId,options:{validate:"vault"===e.flow&&!r}}};return t.ba_token?o.paypalAccount.billingAgreementToken=t.ba_token:(o.paypalAccount.paymentToken=t.paymentId,o.paypalAccount.payerId=t.PayerID,o.paypalAccount.unilateral=i.paypal.unvettedMerchant,e.hasOwnProperty("intent")&&(o.paypalAccount.intent=e.intent)),o},i.prototype._navigateFrameToAuth=function(e,t){var n=this._client,i="paypal_hermes/";if("checkout"===e.flow)i+="create_payment_resource";else{if("vault"!==e.flow)return void t(new o(f.PAYPAL_FLOW_OPTION_REQUIRED));i+="setup_billing_agreement"}n.request({endpoint:i,method:"post",data:this._formatPaymentResourceData(e)},function(n,i,r){var a;n?(t(422===r?new o({type:f.PAYPAL_INVALID_PAYMENT_OPTION.type,code:f.PAYPAL_INVALID_PAYMENT_OPTION.code,message:f.PAYPAL_INVALID_PAYMENT_OPTION.message,details:{originalError:n}}):n instanceof o?n:new o({type:f.PAYPAL_FLOW_FAILED.type,code:f.PAYPAL_FLOW_FAILED.code,message:f.PAYPAL_FLOW_FAILED.message,details:{originalError:n}})),this._frameService.close()):(a="checkout"===e.flow?i.paymentResource.redirectUrl:i.agreementSetup.approvalUrl,"commit"===e.useraction&&(a=E.queryify(a,{useraction:"commit"})),this._frameService.redirect(a))}.bind(this))},i.prototype._formatPaymentResourceData=function(e){var t,n=this._client.getConfiguration().gatewayConfiguration,i=this._frameService._serviceId,r={returnUrl:n.paypal.assetsUrl+"/web/"+s+"/html/paypal-redirect-frame.min.html?channel="+i,cancelUrl:n.paypal.assetsUrl+"/web/"+s+"/html/paypal-cancel-frame.min.html?channel="+i,correlationId:i,experienceProfile:{brandName:e.displayName||n.paypal.displayName,localeCode:e.locale,noShipping:(!e.enableShippingAddress).toString(),addressOverride:e.shippingAddressEditable===!1}};if("checkout"===e.flow){r.amount=e.amount,r.currencyIsoCode=e.currency,r.offerPaypalCredit=e.offerCredit===!0,e.hasOwnProperty("intent")&&(r.intent=e.intent);for(t in e.shippingAddressOverride)e.shippingAddressOverride.hasOwnProperty(t)&&(r[t]=e.shippingAddressOverride[t])}else r.shippingAddress=e.shippingAddressOverride,e.billingAgreementDescription&&(r.description=e.billingAgreementDescription);return r},i.prototype.teardown=function(e){this._frameService.teardown(),h(this,p(i.prototype)),d.sendEvent(this._client,"web.paypal.teardown-completed"),"function"==typeof e&&(e=_(e))()},t.exports=i},{"../../lib/analytics":39,"../../lib/constants":47,"../../lib/convert-methods-to-error":48,"../../lib/deferred":50,"../../lib/error":53,"../../lib/frame-service/external":56,"../../lib/methods":67,"../../lib/once":68,"../../lib/querystring":70,"../../lib/throw-if-no-callback":71,"../shared/constants":75,"../shared/errors":76}],74:[function(e,t,n){"use strict";function i(e,t){var n,i,_;return l(t,"create"),t=s(t),null==e.client?void t(new o({type:u.INSTANTIATION_OPTION_REQUIRED.type,code:u.INSTANTIATION_OPTION_REQUIRED.code,message:"options.client is required when instantiating PayPal."})):(n=e.client.getConfiguration(),_=n.analyticsMetadata.sdkVersion,_!==p?void t(new o({type:u.INCOMPATIBLE_VERSIONS.type,code:u.INCOMPATIBLE_VERSIONS.code,message:"Client (version "+_+") and PayPal (version "+p+") components must be from the same SDK version."})):n.gatewayConfiguration.paypalEnabled!==!0?void t(new o(c.PAYPAL_NOT_ENABLED)):a.supportsPopups()?(r.sendEvent(e.client,"web.paypal.initialized"),i=new d(e),void i._initialize(function(){t(null,i)})):void t(new o(c.PAYPAL_BROWSER_NOT_SUPPORTED)))}var r=e("../lib/analytics"),o=e("../lib/error"),a=e("../lib/browser-detection"),s=e("../lib/deferred"),c=e("./shared/errors"),l=e("../lib/throw-if-no-callback"),d=e("./external/paypal"),u=e("../errors"),p="3.5.0";t.exports={create:i,VERSION:p}},{"../errors":29,"../lib/analytics":39,"../lib/browser-detection":41,"../lib/deferred":50,"../lib/error":53,"../lib/throw-if-no-callback":71,"./external/paypal":73,"./shared/errors":76}],75:[function(e,t,n){"use strict";var i=535,r=450;t.exports={AUTH_INIT_ERROR_MESSAGE:"Could not initialize PayPal flow.",LANDING_FRAME_NAME:"braintreepaypallanding",POPUP_BASE_OPTIONS:"resizable,scrollbars,height="+i+",width="+r,POPUP_WIDTH:r,POPUP_HEIGHT:i,POPUP_POLL_INTERVAL:100}},{}],76:[function(e,t,n){"use strict";var i=e("../../lib/error");t.exports={PAYPAL_NOT_ENABLED:{type:i.types.MERCHANT,code:"PAYPAL_NOT_ENABLED",message:"PayPal is not enabled for this merchant."},PAYPAL_TOKENIZATION_REQUEST_ACTIVE:{type:i.types.MERCHANT,code:"PAYPAL_TOKENIZATION_REQUEST_ACTIVE",message:"Another tokenization request is active."},PAYPAL_ACCOUNT_TOKENIZATION_FAILED:{type:i.types.NETWORK,code:"PAYPAL_ACCOUNT_TOKENIZATION_FAILED",message:"Could not tokenize user's PayPal account."},PAYPAL_FLOW_FAILED:{type:i.types.NETWORK,code:"PAYPAL_FLOW_FAILED",message:"Could not initialize PayPal flow."},PAYPAL_FLOW_OPTION_REQUIRED:{type:i.types.MERCHANT,code:"PAYPAL_FLOW_OPTION_REQUIRED",message:"PayPal flow property is invalid or missing."},PAYPAL_BROWSER_NOT_SUPPORTED:{type:i.types.CUSTOMER,code:"PAYPAL_BROWSER_NOT_SUPPORTED",message:"Browser is not supported."},PAYPAL_POPUP_CLOSED:{type:i.types.CUSTOMER,code:"PAYPAL_POPUP_CLOSED",message:"Customer closed PayPal popup before authorizing."},PAYPAL_INVALID_PAYMENT_OPTION:{type:i.types.MERCHANT,code:"PAYPAL_INVALID_PAYMENT_OPTION",message:"PayPal payment options are invalid."}}},{"../../lib/error":53}],77:[function(e,t,n){"use strict";function i(e){this._options=e,this._assetsUrl=e.client.getConfiguration().gatewayConfiguration.assetsUrl,this._client=e.client}var r=e("../../lib/error"),o=e("../../lib/analytics"),a=e("../../lib/methods"),s=e("../../lib/convert-methods-to-error"),c=e("../shared/constants"),l=e("../../lib/bus"),d=e("../../lib/uuid"),u=e("../../lib/deferred"),p=e("../shared/errors"),_=e("../../lib/throw-if-no-callback"),f=e("../shared/events"),h="3.5.0",E=e("iframer"),I=400,y=400;i.prototype.verifyCard=function(e,t){var n,i,o,a,s;return _(t,"verifyCard"),e=e||{},t=u(t),this._verifyCardInProgress===!0?a=p.THREEDS_AUTHENTICATION_IN_PROGRESS:e.nonce?e.amount?"function"!=typeof e.addFrame?s="an addFrame function":"function"!=typeof e.removeFrame&&(s="a removeFrame function"):s="an amount":s="a nonce",s&&(a={type:p.THREEDS_MISSING_VERIFY_CARD_OPTION.type,code:p.THREEDS_MISSING_VERIFY_CARD_OPTION.code,message:"verifyCard options must include "+s+"."}),a?void t(new r(a)):(this._verifyCardInProgress=!0,i=u(e.addFrame),o=u(e.removeFrame),n="payment_methods/"+e.nonce+"/three_d_secure/lookup",void this._client.request({endpoint:n,method:"post",data:{amount:e.amount}},function(e,n){return e?void t(e):(this._lookupPaymentMethod=n.paymentMethod,this._verifyCardCallback=function(){this._verifyCardInProgress=!1,t.apply(null,arguments)}.bind(this),void this._handleLookupResponse({lookupResponse:n,addFrame:i,removeFrame:o}))}.bind(this)))},i.prototype.cancelVerifyCard=function(e){var t;this._verifyCardInProgress=!1,"function"==typeof e&&(this._lookupPaymentMethod||(t=new r(p.THREEDS_NO_VERIFICATION_PAYLOAD)),e(t,this._lookupPaymentMethod))},i.prototype._handleLookupResponse=function(e){var t=e.lookupResponse;t.lookup&&t.lookup.acsUrl&&t.lookup.acsUrl.length>0?e.addFrame(null,this._createIframe({response:t.lookup,removeFrame:e.removeFrame})):this._verifyCardCallback(null,{nonce:t.paymentMethod.nonce,verificationDetails:t.threeDSecureInfo})},i.prototype._createIframe=function(e){var t,n,i=window.location.href,r=e.response;return this._bus=new l({channel:d(),merchantUrl:location.href}),n=this._assetsUrl+"/web/"+h+"/html/three-d-secure-authentication-complete-frame.html?channel="+encodeURIComponent(this._bus.channel)+"&",i.indexOf("#")>-1&&(i=i.split("#")[0]),this._bus.on(l.events.CONFIGURATION_REQUEST,function(e){e({acsUrl:r.acsUrl,pareq:r.pareq,termUrl:r.termUrl+"&three_d_secure_version="+h+"&authentication_complete_base_url="+encodeURIComponent(n),md:r.md,parentUrl:i})}),this._bus.on(f.AUTHENTICATION_COMPLETE,function(t){this._handleAuthResponse(t,e)}.bind(this)),t=this._assetsUrl+"/web/"+h+"/html/three-d-secure-bank-frame.min.html",this._bankIframe=E({src:t,height:I,width:y,name:c.LANDING_FRAME_NAME+"_"+this._bus.channel}),this._bankIframe},i.prototype._handleAuthResponse=function(e,t){var n=JSON.parse(e.auth_response);this._bus.teardown(),t.removeFrame(),u(function(){n.success?this._verifyCardCallback(null,this._formatAuthResponse(n.paymentMethod,n.threeDSecureInfo)):n.threeDSecureInfo&&n.threeDSecureInfo.liabilityShiftPossible?this._verifyCardCallback(null,this._formatAuthResponse(this._lookupPaymentMethod,n.threeDSecureInfo)):this._verifyCardCallback(new r({type:r.types.UNKNOWN,code:"UNKNOWN_AUTH_RESPONSE",message:n.error.message}))}.bind(this))()},i.prototype._formatAuthResponse=function(e,t){return{nonce:e.nonce,details:e.details,description:e.description,liabilityShifted:t.liabilityShifted,liabilityShiftPossible:t.liabilityShiftPossible}},i.prototype.teardown=function(e){var t;s(this,a(i.prototype)),o.sendEvent(this._options.client,"web.threedsecure.teardown-completed"),this._bus&&this._bus.teardown(),this._bankIframe&&(t=this._bankIframe.parentNode,t&&t.removeChild(this._bankIframe)),"function"==typeof e&&(e=u(e))()},t.exports=i},{"../../lib/analytics":39,"../../lib/bus":44,"../../lib/convert-methods-to-error":48,"../../lib/deferred":50,"../../lib/error":53,"../../lib/methods":67,"../../lib/throw-if-no-callback":71,"../../lib/uuid":72,"../shared/constants":79,"../shared/errors":80,"../shared/events":81,iframer:3}],78:[function(e,t,n){"use strict";function i(e,t){var n,i,_,f;if(c(t,"create"),t=l(t),null==e.client)return void t(new a({type:u.INSTANTIATION_OPTION_REQUIRED.type,code:u.INSTANTIATION_OPTION_REQUIRED.code,message:"options.client is required when instantiating 3D Secure."}));if(n=e.client.getConfiguration(),f=n.analyticsMetadata.sdkVersion,n.gatewayConfiguration.threeDSecureEnabled?n.analyticsMetadata.sdkVersion!==p?_={type:u.INCOMPATIBLE_VERSIONS.type,code:u.INCOMPATIBLE_VERSIONS.code,message:"Client (version "+f+") and 3D Secure (version "+p+") components must be from the same SDK version."}:o.isHTTPS()||(_=d.THREEDS_HTTPS_REQUIRED):_=d.THREEDS_NOT_ENABLED,_)return void t(new a(_));s.sendEvent(e.client,"web.threedsecure.initialized");try{i=new r(e)}catch(h){return void t(h)}t(null,i)}var r=e("./external/three-d-secure"),o=e("../lib/browser-detection"),a=e("../lib/error"),s=e("../lib/analytics"),c=e("../lib/throw-if-no-callback"),l=e("../lib/deferred"),d=e("./shared/errors"),u=e("../errors"),p="3.5.0";t.exports={create:i,VERSION:p}},{"../errors":29,"../lib/analytics":39,"../lib/browser-detection":41,"../lib/deferred":50,"../lib/error":53,"../lib/throw-if-no-callback":71,"./external/three-d-secure":77,"./shared/errors":80}],79:[function(e,t,n){"use strict";t.exports={LANDING_FRAME_NAME:"braintreethreedsecurelanding"}},{}],80:[function(e,t,n){"use strict";var i=e("../../lib/error");t.exports={THREEDS_AUTHENTICATION_IN_PROGRESS:{type:i.types.MERCHANT,code:"THREEDS_AUTHENTICATION_IN_PROGRESS",message:"Cannot call verifyCard while existing authentication is in progress."},THREEDS_MISSING_VERIFY_CARD_OPTION:{type:i.types.MERCHANT,code:"THREEDS_MISSING_VERIFY_CARD_OPTION"},THREEDS_NO_VERIFICATION_PAYLOAD:{type:i.types.MERCHANT,code:"THREEDS_NO_VERIFICATION_PAYLOAD",message:"No verification payload available."},THREEDS_NOT_ENABLED:{type:i.types.MERCHANT,code:"THREEDS_NOT_ENABLED",message:"3D Secure is not enabled for this merchant."},THREEDS_HTTPS_REQUIRED:{type:i.types.MERCHANT,code:"THREEDS_HTTPS_REQUIRED",message:"3D Secure requires HTTPS."},THREEDS_TERM_URL_REQUIRES_BRAINTREE_DOMAIN:{type:i.types.INTERNAL,code:"THREEDS_TERM_URL_REQUIRES_BRAINTREE_DOMAIN",message:"Term Url must be on a Braintree domain."}}},{"../../lib/error":53}],81:[function(e,t,n){"use strict";var i=e("../../lib/enumerate");t.exports=i(["AUTHENTICATION_COMPLETE"],"threedsecure:")},{"../../lib/enumerate":52}],82:[function(e,t,n){"use strict";function i(e,t){var n,i;return c(t,"create"),t=s(t),null==e.client?void t(new o({type:d.INSTANTIATION_OPTION_REQUIRED.type,code:d.INSTANTIATION_OPTION_REQUIRED.code,message:"options.client is required when instantiating UnionPay."})):(n=e.client.getConfiguration(),i=n.analyticsMetadata.sdkVersion,i!==u?void t(new o({type:d.INCOMPATIBLE_VERSIONS.type,code:d.INCOMPATIBLE_VERSIONS.code,message:"Client (version "+i+") and UnionPay (version "+u+") components must be from the same SDK version."})):n.gatewayConfiguration.unionPay&&n.gatewayConfiguration.unionPay.enabled===!0?(a.sendEvent(e.client,"web.unionpay.initialized"),void t(null,new r(e))):void t(new o(l.UNIONPAY_NOT_ENABLED)))}var r=e("./shared/unionpay"),o=e("../lib/error"),a=e("../lib/analytics"),s=e("../lib/deferred"),c=e("../lib/throw-if-no-callback"),l=e("./shared/errors"),d=e("../errors"),u="3.5.0";t.exports={create:i,VERSION:u}},{"../errors":29,"../lib/analytics":39,"../lib/deferred":50,"../lib/error":53,"../lib/throw-if-no-callback":71,"./shared/errors":84,"./shared/unionpay":85}],83:[function(e,t,n){"use strict";var i=e("../../lib/enumerate");t.exports={events:i(["HOSTED_FIELDS_FETCH_CAPABILITIES","HOSTED_FIELDS_ENROLL","HOSTED_FIELDS_TOKENIZE"],"union-pay:"),HOSTED_FIELDS_FRAME_NAME:"braintreeunionpayhostedfields"}},{"../../lib/enumerate":52}],84:[function(e,t,n){"use strict";var i=e("../../lib/error");t.exports={UNIONPAY_NOT_ENABLED:{type:i.types.MERCHANT,code:"UNIONPAY_NOT_ENABLED",message:"UnionPay is not enabled for this merchant."},UNIONPAY_HOSTED_FIELDS_INSTANCE_INVALID:{type:i.types.MERCHANT,code:"UNIONPAY_HOSTED_FIELDS_INSTANCE_INVALID",message:"Found an invalid Hosted Fields instance. Please use a valid Hosted Fields instance."},UNIONPAY_HOSTED_FIELDS_INSTANCE_REQUIRED:{type:i.types.MERCHANT,code:"UNIONPAY_HOSTED_FIELDS_INSTANCE_REQUIRED",message:"Could not find the Hosted Fields instance."},UNIONPAY_CARD_OR_HOSTED_FIELDS_INSTANCE_REQUIRED:{type:i.types.MERCHANT,code:"UNIONPAY_CARD_OR_HOSTED_FIELDS_INSTANCE_REQUIRED",message:"A card or a Hosted Fields instance is required. Please supply a card or a Hosted Fields instance."},UNIONPAY_CARD_AND_HOSTED_FIELDS_INSTANCES:{type:i.types.MERCHANT,code:"UNIONPAY_CARD_AND_HOSTED_FIELDS_INSTANCES",message:"Please supply either a card or a Hosted Fields instance, not both."},UNIONPAY_EXPIRATION_DATE_INCOMPLETE:{type:i.types.MERCHANT,code:"UNIONPAY_EXPIRATION_DATE_INCOMPLETE",message:"You must supply expiration month and year or neither."},UNIONPAY_ENROLLMENT_CUSTOMER_INPUT_INVALID:{type:i.types.CUSTOMER,code:"UNIONPAY_ENROLLMENT_CUSTOMER_INPUT_INVALID",message:"Enrollment failed due to user input error."},UNIONPAY_ENROLLMENT_NETWORK_ERROR:{type:i.types.NETWORK,code:"UNIONPAY_ENROLLMENT_NETWORK_ERROR",message:"Could not enroll UnionPay card."},UNIONPAY_FETCH_CAPABILITIES_NETWORK_ERROR:{type:i.types.NETWORK,code:"UNIONPAY_FETCH_CAPABILITIES_NETWORK_ERROR",message:"Could not fetch card capabilities."},UNIONPAY_TOKENIZATION_NETWORK_ERROR:{type:i.types.NETWORK,code:"UNIONPAY_TOKENIZATION_NETWORK_ERROR",message:"A tokenization network error occurred."},UNIONPAY_MISSING_MOBILE_PHONE_DATA:{type:i.types.MERCHANT,code:"UNIONPAY_MISSING_MOBILE_PHONE_DATA",message:"A `mobile` with `countryCode` and `number` is required."},UNIONPAY_FAILED_TOKENIZATION:{type:i.types.CUSTOMER,code:"UNIONPAY_FAILED_TOKENIZATION",message:"The supplied card data failed tokenization."}}},{"../../lib/error":53}],85:[function(e,t,n){"use strict";function i(e){this._options=e}var r=e("../../lib/analytics"),o=e("../../lib/error"),a=e("../../lib/bus"),s=e("./constants"),c=e("../../lib/convert-methods-to-error"),l=e("../../lib/deferred"),d=e("./errors"),u=s.events,p=e("iframer"),_=e("../../lib/methods"),f="3.5.0",h=e("../../lib/uuid"),E=e("../../lib/throw-if-no-callback");i.prototype.fetchCapabilities=function(e,t){var n=this._options.client,i=e.card?e.card.number:null,a=e.hostedFields;if(E(t,"fetchCapabilities"),t=l(t),i&&a)return void t(new o(d.UNIONPAY_CARD_AND_HOSTED_FIELDS_INSTANCES));if(i)n.request({method:"get",endpoint:"payment_methods/credit_cards/capabilities",data:{_meta:{source:"unionpay"},creditCard:{number:i}}},function(e,i,a){return e?(t(403===a?e:new o({type:d.UNIONPAY_FETCH_CAPABILITIES_NETWORK_ERROR.type,code:d.UNIONPAY_FETCH_CAPABILITIES_NETWORK_ERROR.code,message:d.UNIONPAY_FETCH_CAPABILITIES_NETWORK_ERROR.message,details:{originalError:e}})),void r.sendEvent(n,"web.unionpay.capabilities-failed")):(r.sendEvent(n,"web.unionpay.capabilities-received"),void t(null,i))});else{if(!a)return void t(new o(d.UNIONPAY_CARD_OR_HOSTED_FIELDS_INSTANCE_REQUIRED));if(!a._bus)return void t(new o(d.UNIONPAY_HOSTED_FIELDS_INSTANCE_INVALID));this._initializeHostedFields(function(){this._bus.emit(u.HOSTED_FIELDS_FETCH_CAPABILITIES,{hostedFields:a},function(e){return e.err?void t(new o(e.err)):void t(null,e.payload)})}.bind(this))}},i.prototype.enroll=function(e,t){var n,i=this._options.client,a=e.card,s=e.mobile,c=e.hostedFields;if(E(t,"enroll"),t=l(t),!s)return void t(new o(d.UNIONPAY_MISSING_MOBILE_PHONE_DATA));if(c){if(!c._bus)return void t(new o(d.UNIONPAY_HOSTED_FIELDS_INSTANCE_INVALID));if(a)return void t(new o(d.UNIONPAY_CARD_AND_HOSTED_FIELDS_INSTANCES));this._initializeHostedFields(function(){this._bus.emit(u.HOSTED_FIELDS_ENROLL,{hostedFields:c,mobile:s},function(e){return e.err?void t(new o(e.err)):void t(null,e.payload)})}.bind(this))}else{if(!a||!a.number)return void t(new o(d.UNIONPAY_CARD_OR_HOSTED_FIELDS_INSTANCE_REQUIRED));if(n={_meta:{source:"unionpay"},unionPayEnrollment:{number:a.number,mobileCountryCode:s.countryCode,mobileNumber:s.number}},a.expirationDate)n.unionPayEnrollment.expirationDate=a.expirationDate;else if(a.expirationMonth||a.expirationYear){if(!a.expirationMonth||!a.expirationYear)return void t(new o(d.UNIONPAY_EXPIRATION_DATE_INCOMPLETE));n.unionPayEnrollment.expirationYear=a.expirationYear,n.unionPayEnrollment.expirationMonth=a.expirationMonth}i.request({method:"post",endpoint:"union_pay_enrollments",data:n},function(e,n,a){var s;return e?(403===a?s=e:500>a?(s=new o(d.UNIONPAY_ENROLLMENT_CUSTOMER_INPUT_INVALID),s.details={originalError:e}):(s=new o(d.UNIONPAY_ENROLLMENT_NETWORK_ERROR),s.details={originalError:e}),r.sendEvent(i,"web.unionpay.enrollment-failed"),void t(s)):(r.sendEvent(i,"web.unionpay.enrollment-succeeded"),void t(null,{enrollmentId:n.unionPayEnrollmentId,smsCodeRequired:n.smsCodeRequired}))})}},i.prototype.tokenize=function(e,t){var n,i,a,s=this._options.client,c=e.card,p=e.hostedFields;if(E(t,"tokenize"),t=l(t),c&&p)return void t(new o(d.UNIONPAY_CARD_AND_HOSTED_FIELDS_INSTANCES));if(c)n={_meta:{source:"unionpay"},creditCard:{number:e.card.number,options:{unionPayEnrollment:{id:e.enrollmentId}}}},e.smsCode&&(n.creditCard.options.unionPayEnrollment.smsCode=e.smsCode),c.expirationDate?n.creditCard.expirationDate=c.expirationDate:c.expirationMonth&&c.expirationYear&&(n.creditCard.expirationYear=c.expirationYear,n.creditCard.expirationMonth=c.expirationMonth),e.card.cvv&&(n.creditCard.cvv=e.card.cvv),s.request({method:"post",endpoint:"payment_methods/credit_cards",data:n},function(e,n,c){return e?(r.sendEvent(s,"web.unionpay.nonce-failed"),403===c?a=e:500>c?(a=new o(d.UNIONPAY_FAILED_TOKENIZATION),a.details={originalError:e}):(a=new o(d.UNIONPAY_TOKENIZATION_NETWORK_ERROR),a.details={originalError:e}),void t(a)):(i=n.creditCards[0],delete i.consumed,delete i.threeDSecureInfo,r.sendEvent(s,"web.unionpay.nonce-received"),void t(null,i))});else{if(!p)return void t(new o(d.UNIONPAY_CARD_OR_HOSTED_FIELDS_INSTANCE_REQUIRED));if(!p._bus)return void t(new o(d.UNIONPAY_HOSTED_FIELDS_INSTANCE_INVALID));this._initializeHostedFields(function(){this._bus.emit(u.HOSTED_FIELDS_TOKENIZE,e,function(e){return e.err?void t(new o(e.err)):void t(null,e.payload)})}.bind(this))}},i.prototype.teardown=function(e){this._bus&&(this._hostedFieldsFrame.parentNode.removeChild(this._hostedFieldsFrame),this._bus.teardown()),c(this,_(i.prototype)),"function"==typeof e&&(e=l(e))()},i.prototype._initializeHostedFields=function(e){var t=h();return this._bus?void e():(this._bus=new a({channel:t,merchantUrl:location.href}),this._hostedFieldsFrame=p({name:s.HOSTED_FIELDS_FRAME_NAME+"_"+t,src:this._options.client.getConfiguration().gatewayConfiguration.assetsUrl+"/web/"+f+"/html/unionpay-hosted-fields-frame.min.html",height:0,width:0}),this._bus.on(a.events.CONFIGURATION_REQUEST,function(t){t(this._options.client),e()}.bind(this)),void document.body.appendChild(this._hostedFieldsFrame))},t.exports=i},{"../../lib/analytics":39,"../../lib/bus":44,"../../lib/convert-methods-to-error":48,"../../lib/deferred":50,"../../lib/error":53,"../../lib/methods":67,"../../lib/throw-if-no-callback":71,"../../lib/uuid":72,"./constants":83,"./errors":84,iframer:3}],86:[function(e,t,n){"use strict";t.exports={REQUIRED_BANK_DETAILS:["routingNumber","accountNumber","accountType","accountHolderName","billingAddress"],PLAID_LINK_JS:"https://cdn.plaid.com/link/stable/link-initialize.js"}},{}],87:[function(e,t,n){"use strict";var i=e("../lib/error");t.exports={US_BANK_OPTION_REQUIRED:{type:i.types.MERCHANT,code:"US_BANK_OPTION_REQUIRED"},US_BANK_MUTUALLY_EXCLUSIVE_OPTIONS:{type:i.types.MERCHANT,code:"US_BANK_MUTUALLY_EXCLUSIVE_OPTIONS"},US_BANK_LOGIN_LOAD_FAILED:{type:i.types.NETWORK,code:"US_BANK_LOGIN_LOAD_FAILED",message:"Bank login flow failed to load."}}},{"../lib/error":53}],88:[function(e,t,n){"use strict";function i(e,t){var n,i;return s(t,"create"),t=a(t),null==e.client?void t(new r({type:l.INSTANTIATION_OPTION_REQUIRED.type,code:l.INSTANTIATION_OPTION_REQUIRED.code,message:"options.client is required when instantiating US Bank Account."})):(n=e.client.getConfiguration().analyticsMetadata.sdkVersion,n!==c?void t(new r({type:l.INCOMPATIBLE_VERSIONS.type,code:l.INCOMPATIBLE_VERSIONS.code,message:"Client (version "+n+") and US Bank Account (version "+c+") components must be from the same SDK version."})):(i=e.client.getConfiguration().gatewayConfiguration.braintreeApi)?void t(null,new o(e)):void t(new r(l.BRAINTREE_API_ACCESS_RESTRICTED)))}var r=e("../lib/error"),o=e("./us-bank-account"),a=e("../lib/deferred"),s=e("../lib/throw-if-no-callback"),c="3.5.0",l=e("../errors");t.exports={create:i,VERSION:c}},{"../errors":29,"../lib/deferred":50,"../lib/error":53,"../lib/throw-if-no-callback":71,"./us-bank-account":89}],89:[function(e,t,n){(function(n){"use strict";function i(e){this._client=e.client}function r(e){return{nonce:e.data.id,details:{},description:e.data.description,type:e.data.type}}function o(e){e.onerror=e.onload=e.onreadystatechange=null}var a=e("../lib/error"),s=e("./constants"),c=e("./errors"),l=e("../lib/deferred"),d=e("../lib/once"),u=e("../lib/throw-if-no-callback"),p=e("../lib/camel-case-to-snake-case");i.prototype.tokenize=function(e,t){return u(t,"tokenize"),e=e||{},t=l(t),e.mandateText?void(e.bankDetails&&e.bankLogin?t(new a({type:c.US_BANK_MUTUALLY_EXCLUSIVE_OPTIONS.type,code:c.US_BANK_MUTUALLY_EXCLUSIVE_OPTIONS.code,message:"tokenize must be called with bankDetails or bankLogin, not both."})):e.bankDetails?this._tokenizeBankDetails(e,t):e.bankLogin?this._tokenizeBankLogin(e,t):t(new a({type:c.US_BANK_OPTION_REQUIRED.type,code:c.US_BANK_OPTION_REQUIRED.code,message:"tokenize must be called with bankDetails or bankLogin."}))):void t(new a({type:c.US_BANK_OPTION_REQUIRED.type,code:c.US_BANK_OPTION_REQUIRED.code,message:"mandateText property is required."}))},i.prototype._tokenizeBankDetails=function(e,t){var n,i,o=e.bankDetails,l=this._client.getConfiguration().gatewayConfiguration.braintreeApi;for(n=0;n<s.REQUIRED_BANK_DETAILS.length;n++)if(i=s.REQUIRED_BANK_DETAILS[n],!o[i])return void t(new a({type:c.US_BANK_OPTION_REQUIRED.type,code:c.US_BANK_OPTION_REQUIRED.code,message:"bankDetails."+i+" property is required."}));this._client._request({method:"POST",url:l.url+"/tokens",headers:{Authorization:"Bearer "+l.accessToken,"Braintree-Version":"2016-08-25"},data:{type:"us_bank_account",routing_number:o.routingNumber,account_number:o.accountNumber,account_holder_name:o.accountHolderName,account_type:o.accountType,billing_address:p(o.billingAddress),ach_mandate:{text:e.mandateText}}},function(e,n){return e?void t(e):void t(null,r(n))})},i.prototype._tokenizeBankLogin=function(e,t){var n=this._client,i=this._client.getConfiguration().gatewayConfiguration.braintreeApi;
return e.bankLogin.displayName?void this._loadPlaid(function(o,a){return o?void t(o):void a.create({env:"tartan",clientName:e.bankLogin.displayName,key:"test_key",product:"auth",selectAccount:!0,onExit:function(){t(new Error("Customer closed bank login flow."))},onSuccess:function(o,a){n._request({method:"POST",url:i.url+"/tokens",headers:{Authorization:"Bearer "+i.accessToken,"Braintree-Version":"2016-08-25"},data:{type:"plaid_public_token",public_token:o,account_id:a.account_id,ach_mandate:{text:e.mandateText}}},function(e,n){return e?void t(e):void t(null,r(n))})}}).open()}):void t(new a({type:c.US_BANK_OPTION_REQUIRED.type,code:c.US_BANK_OPTION_REQUIRED.code,message:"displayName property is required when using bankLogin."}))},i.prototype._loadPlaid=function(e){var t;return e=d(e),n.Plaid?void e(null,n.Plaid):(t=document.createElement("script"),t.src=s.PLAID_LINK_JS,t.async=!0,t.onerror=function(){o(t),e(new a(c.US_BANK_LOGIN_LOAD_FAILED))},t.onload=t.onreadystatechange=function(){this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState||(o(t),e(null,n.Plaid))},document.body.appendChild(t),void(this._plaidScript=t))},i.prototype.teardown=function(){this._plaidScript&&document.body.removeChild(this._plaidScript)},t.exports=i}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../lib/camel-case-to-snake-case":45,"../lib/deferred":50,"../lib/error":53,"../lib/once":68,"../lib/throw-if-no-callback":71,"./constants":86,"./errors":87}]},{},[37])(37)});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
