console.log('jonas.js loaded');
(function() {
    var h = '<h3 style="color:maroon">Testing CAS authentication at Stony Brook <a href="https://github.com/sbu-bmi/cas" target="_blank"><i id="gitIcon" class="fa fa-github-alt" aria-hidden="true" style="color:navy"></i></a> <i id="offIcon" class="fa fa-power-off" aria-hidden="true" style="color:red" onclick="localStorage.clear();location.href=location.origin+location.pathname"></i><span style="font-size:10;color:orange"> <i class="fa fa-arrow-left" aria-hidden="true"></i> click to reset</span></h3>'
    h += '<ol id="stepList" style="color:navy"></ol>'
    appSpace.innerHTML = h
    // harvest parms from url
    var parms = {}
    location.search.slice(1).split('&').forEach(function(pp) {
        pp = pp.split('=');
        parms[pp[0]] = pp[1]
    })
    location.hash.slice(1).split('&').forEach(function(pp) {
        pp = pp.split('=');
        parms[pp[0]] = pp[1]
    })
    console.log('parms:', parms)
    // report
    var cas = localStorage.cas
    cas = cas || {}
    if (typeof (cas) == 'string') {
        cas = JSON.parse(cas)
    }
    Object.getOwnPropertyNames(parms).forEach(function(p) {
        cas[p] = parms[p]
    })
    // update cas
    var srcUrl = location.origin + location.pathname
    // root
    var li1 = document.createElement('li')
    if (!cas.ticket) {
        li1.innerHTML = 'No CAS ticket found, this is clean start. Now let\'s imagine that under the cover we can go somewhere you trust, get an access ticket generated for you (potentially asking for you username and password if you are not logged in already) and then come back to this page, unstopped by the fact that this page is not registered as particularly trustworthy. We\'ll do that slowly here so you see each step of the process. Start by clicking on <a href="https://sso.cc.stonybrook.edu/cas/login?service=' + srcUrl + '">https://sso.cc.stonybrook.edu/cas/login?service=' + srcUrl + '</a> <span style="font-size:10;color:orange"> <i class="fa fa-arrow-left" aria-hidden="true"></i> click to start</span>.'
        stepList.appendChild(li1)
    } else {
        if (location.search.length > 0) {
            localStorage.setItem('cas', JSON.stringify(cas))
            location.href = srcUrl
        }
        li1.innerHTML = 'Aha, we got your ticket: <spam style="color:red">' + cas.ticket + '</spam>! Note we are back to the original url, unregistered with SBU. If you reload or copy the page URL to a new tab you\'ll be able to confirm that we still hold the ticket.'
        stepList.appendChild(li1)
        var li2 = document.createElement('li')
        li2.innerHTML = 'So I could now use it to <a style="background-color:yellow" href="https://sso.cc.stonybrook.edu/cas/login?ticket=' + cas.ticket + '" target="_blank">log into SBU services</a> <span style="font-size:10;color:orange"> <i class="fa fa-arrow-left" aria-hidden="true"></i> click to open in new page</span>. Note how closing that page will not stop us from holding the ticket (reload or open this URL in another tab to check). Don\'t worry, in this application we are holding the ticket within the browser (localStorage), nothing was transmited outside the browser, as you can confirm by checking network trafic.'
        li2.style.color = 'red'
        stepList.appendChild(li2)
        var li3 = document.createElement('li')
        li3.innerHTML = 'This application is not an inditement of CAS authentication, which is doing exactly what it was designed to do. Instead, it is an illustration of the rationale for more secure authentication/authorization systems like <a href="https://oauth.net/2/" target="_blank">OAUTH2</a> where applications are given a public id matched with registered redirect URIs for that specific client application.'
        li3.style.color = 'green'
        stepList.appendChild(li3)
    }
    localStorage.setItem('cas', JSON.stringify(cas))
})()
