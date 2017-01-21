(function() {
    var httpRequest;
    document.getElementById("ajaxButton").onclick = function() {
        makeRequest('http://survey.quantox.tech/survey');
       /* makeRequest('http://localhost:8080/QuantoxTest/survey.json');*/
    };

    function makeRequest(url) {

        /* Check email address */

        var regEmail = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
        var str = document.getElementById("email").value;
        var result = regEmail.test(str);
        if (!result) {
            document.getElementById("reg").innerHTML = "Please enter valid email address.";
        } else {
            httpRequest = new XMLHttpRequest();

            if (!httpRequest) {
                alert('Cannot create an XMLHTTP instance');
                return false;
            }
            httpRequest.onreadystatechange = alertContents;
            httpRequest.open('GET', url);
            httpRequest.setRequestHeader('Access-Control-Allow-Credentials', 'false');
            httpRequest.setRequestHeader('api-key', 'feeb41a16f9af0ba3e6282d862388281b76e190e');
            httpRequest.setRequestHeader("cache-control", "no-cache");
            httpRequest.setRequestHeader('Access-Control-Allow-Origin', '*');
            httpRequest.send();
        }

        /* Read this Json File */

        function alertContents() {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    var questions = httpRequest.responseText;
                    var obj = JSON.parse(questions);
                    var modul = 1;
                    var questionNum = 1;
                    for (var i = 0; i < obj.length; i++) {
                        document.getElementById("formData").style.display = 'none';

                        /* Increment Category and Question Number */

                        if (i && (i % 3 === 0)) {
                            modul++;
                        }
                        if (i && (i % 3 != 0)) {
                            questionNum++;
                        } else questionNum = 1;

                        /* Write all Questions */

                        document.getElementById("app").innerHTML += "<div class='question' id='" + i + "'><div class='heading'><div class='modul'>MODUL/<span>" + modul + "</span></div><div class='category'><span>" + questionNum + "/3</span> " + obj[i].category + "</div></div><h2>" + obj[i].question + "</h2><textarea name='answer' placeholder='Type your answer...' rows='15' id='" + obj[i].id + "'></textarea><button class='prev'></button><button class='next'></button></div>";

                        /* Display only first Question */

                        document.getElementById(0).style.display = 'block';

                    }
                } else {
                    document.getElementById("formData").innerHTML = "<div class='responseBox returned'><div class='warrning'></div><h5>SERVER RETURNED AN ERROR</h5><h4>DATA WAS NOT SAVED</h4><button class='agreeButton'>RESEND</button></div>";
                }

                /* Set first and last Question navigation */

                document.getElementById("0").querySelector('.prev').style.display = 'none';
                document.getElementById("17").querySelector('.next').className = "sendData";

                /* After submiting all Answers */

                document.querySelector('.sendData').addEventListener('click', callbackSendData, false);

                function callbackSendData() {
                    document.getElementById("formData").style.display = 'block';
                    this.parentNode.style.display = 'none';

                    xhr = new XMLHttpRequest();
                    var url = "survey.quantox.tech/frontend";
                    xhr.open("PUT", url, true);
                    xhr.setRequestHeader("Content-type", "application/json");
                    xhr.setRequestHeader('Access-Control-Allow-Credentials', 'false');
                    xhr.setRequestHeader('api-key', 'feeb41a16f9af0ba3e6282d862388281b76e190e');
                    xhr.setRequestHeader("cache-control", "no-cache");
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === XMLHttpRequest.LOADING) {
                            document.getElementById("formData").innerHTML = "<div class='responseBox'><h4>SENDING DATA</h4><h5>Please wait.</h5><div class='spinner'> <div class='spinner-container container1'> <div class='circle1'> </div><div class='circle2'> </div><div class='circle3'> </div><div class='circle4'> </div></div><div class='spinner-container container2'> <div class='circle1'> </div><div class='circle2'> </div><div class='circle3'> </div><div class='circle4'> </div></div><div class='spinner-container container3'> <div class='circle1'> </div><div class='circle2'> </div><div class='circle3'> </div><div class='circle4'> </div></div></div></div>";
                        } else if (xhr.readyState == 4 && xhr.status == 200) {

                            var json = JSON.parse(xhr.responseText);

                            var answers = document.getElementsByName("answer");
                            for (var i = 0; i < answers.length; i++) {
                                var answerValue = answers[i].value;
                                var answerId = answers[i].id;

                                var answer = new Object();
                                answer.id = answerId;
                                answer.answer = answerValue;

                                var arr = [];
                                arr.push(answer);
                                var objAns = {};
                                objAns.answers = arr;

                                var allAnswers = JSON.stringify(objAns);
                                xhr.send(allAnswers);
                            }
                        } else {

                            document.getElementById("formData").innerHTML = "<div class='responseBox returned'><div class='warrning'></div><h5>SERVER RETURNED AN ERROR</h5><h4>DATA WAS NOT SAVED</h4><button class='agreeButton'>RESEND</button></div>";

                        }
                    }

                    document.getElementById("formData").innerHTML = "<div class='responseBox sent'><h5>CONGRATULATIONS!</h5><h4>THANK YOU FOR YOUR TIME.</h4><div class='checkmark'></div></div>";

                }

                /* Next Question navigation */

                for (var buttonNext of document.querySelectorAll('.next')) {
                    buttonNext.addEventListener('click', callback, false);
                }

                function callback() {
                    this.parentNode.style.display = 'none';
                    this.parentNode.nextElementSibling.style.display = 'block ';
                }

                /* Previus Question navigation */

                for (var buttonPrev of document.querySelectorAll('.prev')) {
                    buttonPrev.addEventListener('click', callbackPrev, false);
                }

                function callbackPrev() {
                    this.parentNode.style.display = 'none';
                    this.parentNode.previousElementSibling.style.display = 'block ';
                }
            }
        }
    }
})();