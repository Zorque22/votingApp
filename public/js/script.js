$(document).ready(function(){

  $('.goSignUp').click(function(){
    $('#signUpDiv').hide();
    $('#signUpWrapper').removeClass('hidden').addClass('show');
    $('#loginBtn, #signUpBtn').attr('disabled', 'disabled');
  });
  $('#loginBtn').click(function(){
    // alert('loginbuttn')
    $('#signUpDiv').hide();
    $('#loginWrapper').removeClass('hidden').addClass('show');
    $('#loginBtn, #signUpBtn').attr('disabled', 'disabled');
  });
  $('#signUpSubmitBtn').click(function(){
    console.log('name = '+$('#name').val()+'; email = '+$('#email').val()+'; password = '+$('#password').val())
    // verify email format

    // // post to server
    $.post(
      'http://localhost:3000/signup',
      {
        username:$('#name').val(),
        email:$('#email').val(),
        password:$('#password').val()
      },
      function(data){
        if(data.errorMessage){
            alert('Email address already signed up!');
        } else {
          $('#signUpWrapper').removeClass('show').addClass('hidden');
          $('#welcomeWrapper').removeClass('hidden').addClass('show');
        }
      },
      'json'
    );
  });
  $('#loginBtn2').click(function(){
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
          $('#loginWrapper').removeClass('show').addClass('hidden');
          $('#welcomeWrapper').removeClass('hidden').addClass('show');
        }
      },
      'json'
    );
  })

  $('#moreOptions').click(function(){
    $('#options').append('<input type="text" placeholder="Option"><br>')
  });

})
