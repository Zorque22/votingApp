$(document).ready(function(){
  var userId;
  // console.log('initialize var userId = '+userId)
  function toggleShow(hideDiv, showDiv){
    $(hideDiv).removeClass('show').addClass('hidden');
    $(showDiv).removeClass('hidden').addClass('show');
  }
  function emailCheck(email){
    const emailChck = new RegExp(/^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/);
    // console.log('emailCheck; email = '+email);
    // console.log('emailCheck result: '+emailChck.test(email));
    if(emailChck.test(email)){
      // console.log('emailCheck; return true');
      return true;
    } else {
      // console.log('emailCheck; return false');
      return false;
    }
  }
  $('.goSignUp').click(function(){
    toggleShow('#signUpDiv', '#signUpWrapper');
    // $('#signUpDiv').hide();
    // $('#signUpWrapper').removeClass('hidden').addClass('show');
    $('#loginBtn, #signUpBtn').attr('disabled', 'disabled');
  });
  $('#loginBtn').click(function(){
    // alert('loginbuttn')
    toggleShow('#signUpDiv', '#loginWrapper');
    // $('#signUpDiv').hide();
    // $('#loginWrapper').removeClass('hidden').addClass('show');
    $('#loginBtn, #signUpBtn').attr('disabled', 'disabled');
  });

  $('#signUpSubmitBtn').click(function(){
    // console.log('name = '+$('#name').val()+'; email = '+$('#email').val()+'; password = '+$('#password').val())
    // verify email format
    // console.log('call emailCheck met email: '+$('#signUpEmail').val())
    if(emailCheck($('#signUpEmail').val())){
    // // post to server
      $.post(
        'http://localhost:3000/signup',
        {
          username:$('#signUpName').val(),
          email:$('#signUpEmail').val(),
          password:$('#signUpPassword').val(),
          polls:[]
        },
        function(data){
          if(data.errorMessage){
              alert('Email address already signed up!');
          } else {
            // console.log('data._id = '+data._id);
            userId = data._id;
            // console.log('signup userId = '+userId);
            toggleShow('#signUpWrapper', '#welcomeWrapper');
            // $('#signUpWrapper').removeClass('show').addClass('hidden');
            // $('#welcomeWrapper').removeClass('hidden').addClass('show');
          }
        },
        'json'
      );
    } else {
      alert('Invalid email format.')
    }
  });
  $('#loginSubmitBtn').click(function(){
    $.post(
      'http://localhost:3000/login',
      {
        email:$('#inlogEmail').val(),
        password:$('#inlogPassword').val()
      },
      function(data){
        if(data.errorMessage){
            alert(data.errorMessage);
        } else {
          userId = data._id;
          console.log(data.polls);
          for(var i=0;i<data.polls.length;i++){
            $('#idList').append('<li><a href="localhost:3000/'+data.polls[i].pollName.replace(/ /g,"_")+'" target="_blank">'+data.polls[i].pollName+'</a></li>');
          }
          // console.log('signin userId = '+userId);
          toggleShow('#loginWrapper', '#welcomeWrapper');
          // $('#loginWrapper').removeClass('show').addClass('hidden');
          // $('#welcomeWrapper').removeClass('hidden').addClass('show');
        }
      },
      'json'
    );
  });
  $('#submitPoll').click(function(){
    var poll = {pollName:$('#pollname').val(), options:[]};
    var optionsInput = $('#options').find('input');
    for(var i=0;i<optionsInput.length;i++){
      poll.options.push({description:$(optionsInput[i]).val(), voteCount:0});
    }
    $.post(
      'http://localhost:3000/submitpoll',
      { id:userId,
        poll:poll
      },
      function(data){
        alert(data.pollName)
        if(data.errorMessage){
            alert(data.errorMessage);
        } else {
          $('#newPoll').find('input').val('');
          alert('New poll successfully posted at '+data.pollName);
          toggleShow('#loginWrapper', '#welcomeWrapper');
          $('#idList').append('<li><a href="localhost:3000/'+data.pollName+'">'+data.pollName+'</a></li>');
          // $('#loginWrapper').removeClass('show').addClass('hidden');
          // $('#welcomeWrapper').removeClass('hidden').addClass('show');
        }
      },
      'json'
    );
   });

  $('#moreOptions').click(function(){
    $('#options').append('<input type="text" placeholder="Option"><br>')
  });

})
