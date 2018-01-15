$(document).ready(function(){
  var userId;
  // console.log('initialize var userId = '+userId)
  function toggleShow(hideDiv, showDiv){
    // console.log('toggleShow')
    for(var i=0;i<hideDiv.length;i++){
      $(hideDiv[i]).removeClass('show').addClass('hidden');
    }
    for(var j=0;j<showDiv.length;j++){
      $(showDiv[j]).removeClass('hidden').addClass('show');
    }
  };
  function emailCheck(email){
    const emailChck = new RegExp(/^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/);
    if(emailChck.test(email)){
      return true;
    } else {
      return false;
    }
  };
  function appendMyPoll(pollName, pollId){
    $('#idList').append('<li id="'+pollId+'"><a href="https://zorque-votingapp.herokuapp.com/poll/'+pollName+'" target="_blank">'+pollName+'</a><button class="btn btn-danger delBtn"><span class="glyphicon glyphicon-trash"></span></button></li>');
    // $('#idList').append('<li id="'+pollId+'"><a href="http://localhost:3000/poll/'+pollName+'" target="_blank">'+pollName+'</a><button class="btn btn-danger delBtn"><span class="glyphicon glyphicon-trash"></span></button></li>');
  };
  $('.goSignUp').click(function(){
    if($('#loginWrapper').hasClass('show')){
      toggleShow(['#loginWrapper'], ['#signUpWrapper']);
    } else {
      toggleShow(['#signUpDiv'], ['#signUpWrapper']);
    }
  });
  $('#loginBtn').click(function(){
    if($('#signUpWrapper').hasClass('show')){
      toggleShow(['#signUpWrapper'], ['#loginWrapper']);
    } else {
      toggleShow(['#signUpDiv'], ['#loginWrapper']);
    }
  });

  $('#signUpSubmitBtn').click(function(){
    // verify email format
    console.log('signUpSubmitBtn');
    if($('.errMsg')){
      $('.errMsg').remove()
    }
    if(emailCheck($('#signUpEmail').val())){
    // // post to server
      $.post(
        'https://zorque-votingapp.herokuapp.com/signup',
        // 'http://localhost:3000/signup',
        {
          username:$('#signUpName').val(),
          email:$('#signUpEmail').val().toLowerCase(),
          password:$('#signUpPassword').val(),
          polls:[]
        },
        function(data){
          console.log(data);
          if(data.errorMessage){
            $('#signUpEmailWrapper').append('<p class="errMsg">'+data.errorMessage+'</p>');
          } else {
            userId = data._id;
            toggleShow(['#signUpWrapper', '#loginBtn', '#signUpBtn'], ['#welcomeWrapper', '#logoutBtn', '#loginName']);
            $('#loginName').text(data.userName);
          }
        },
        'json'
      );
    } else {
      $('#signUpEmailWrapper').append('<p class="errMsg">Invalid email format</p>');
    }
  });
  $('#loginSubmitBtn').click(function(){
    if($('.errMsg')){
      $('.errMsg').remove()
    }
    $.post(
      'https://zorque-votingapp.herokuapp.com/login',
      // 'http://localhost:3000/login',
      {
        email:$('#inlogEmail').val().toLowerCase(),
        password:$('#inlogPassword').val()
      },
      function(data){
        if(data.errorMessage){
          console.log('errorMsg: '+data.errorMessage);
          $('#inlogPasswordWrapper').append('<p class="errMsg">'+data.errorMessage+'</p>');
        } else {
          userId = data._id;
          for(var i=0;i<data.polls.length;i++){
            appendMyPoll(data.polls[i].pollName, data.polls[i]._id);
          }
          toggleShow(['#loginWrapper', '#loginBtn', '#signUpBtn'], ['#welcomeWrapper', '#logoutBtn', '#loginName']);
          $('#loginName').text(data.userName);
        }
      },
      'json'
    );
  });
  $('#submitPoll').click(function(){
    if($('.errMsg')){
      $('.errMsg').remove()
    }
    var poll = {pollName:$('#pollName').val().replace(/\?/g,'').toLowerCase(), options:[]};
    var optionsInput = $('#options').find('input');
    for(var i=0;i<optionsInput.length;i++){
      if($(optionsInput[i]).val()!=''){
        poll.options.push({description:$(optionsInput[i]).val(), voteCount:0});
      }
    }
    $.post(
      'https://zorque-votingapp.herokuapp.com/submitpoll',
      // 'http://localhost:3000/submitpoll',
      { id:userId,
        poll:poll
      },
      function(data){
        if(data.errorMessage){
          $('#pollNameWrapper').append('<p class="errMsg">'+data.errorMessage+'</p>')
        } else {
          $('#msg').text('Your poll has been posted to https://zorque-votingapp.herokuapp.com/poll/'+data.pollName);
          // $('#msg').text('Your poll has been posted to http://localhost:3000/poll/'+data.pollName);
          appendMyPoll(data.pollName, data.pollId);
          $('#pollName').val('');
          $('#options').find('input').val('');
          // reduce no of options back to 2
          while($('#options').find('input').length>2){
            $('#options input').last().remove();
          }
          toggleShow(['#welcomeWrapper'], ['#newPollUrlWrapper']);
        }
      },
      'json'
    );
   });

  $('#moreOptions').click(function(){
    $('#options').append('<input type="text" placeholder="Option"><br><br>')
  });
  $('#closeNewUrl').click(function(){
    // console.log('closeNewUrl');
    toggleShow(['#newPollUrlWrapper'], ['#welcomeWrapper']);
  });
  $('#logoutBtn').click(function(){
    location.reload();
  });

  $(document).on('click', '.delBtn', function(event){
    $.post(
      'https://zorque-votingapp.herokuapp.com/deletepoll',
      // 'http://localhost:3000/deletepoll',
      { userId:userId,
        pollId:$(this).parent().attr('id')
      },
      'json'
    );
    $(this).parent().remove();
  });
  // $(document).on('click', '#savePoll', function(event){
  // $('#savePoll').click(function(){
  //   // var choice = $('input[name=option]:checked').val();
  //   console.log('uw keuze = ');
  // })

})
