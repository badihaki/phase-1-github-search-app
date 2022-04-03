/*
1. When form is submitted, it should take the value of input and search Github for user matches
    - Use DOMContentLoaded to set up form after the page loads
2. Using the search results, display info about the users to the page
    - This marks the first DOM content manipulation
    - Display username, avatar, and profile link
3. Clicking on one of the users should send a request to user repos endpoint and return data about the user's repos
4. Using the response of the previous user repos endpoint request we finally display all the info on the page
    - This marks the second and final DOM content manipulation

Final notes:
    - There's a 'ul' with id='user-list' for users
    - There's a 'ul' with id='repos-list' for repositories
    - Search bar text id=search
*/

// Global-Scoped Var

//
// Initialization
document.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('github-form').addEventListener('submit',searchForUsers)

    const userMsg = document.createElement('p');
    userMsg.innerText = `Showing up to the first 20 results. Click image to see public repositories.`
    document.getElementById('github-form').appendChild(userMsg);
})
//
// Functions
function searchForUsers(event){
    event.preventDefault();
    const userList = document.getElementById('user-list');
    const repoList = document.getElementById('repos-list');
    // CLEAR THE USER LIST ~~~~~~~~~~~~~~~~~~~~~~~~~
    const users = document.querySelectorAll('.user');
    users.forEach(user=>user.remove());
    // next up: fetch request to github api for user searches
    const searchingFor = document.getElementById('search').value;
    fetch(`https://api.github.com/search/users?q=${searchingFor}`,{
        headers: {
            Accept: `application/vnd.github.v3+json`
        }
    }).then(response=>response.json()).then((data)=>{
        const returnList = [...data.items];
        returnList.splice(20);
        console.log(returnList);
        console.log(`This is the list we work off ^^^`);
        for(const person of returnList){
            const devName = person.login;
            const devProfile = person[`html_url`]
            const devAvatar = person[`avatar_url`];
            const li = document.createElement(`li`);
            li.innerHTML = `
            <img src = ${devAvatar} />
            <h2>
            ${devName}
            </h2>
            `
            //<a href=${devProfile}>${devName}</a>
            li.className = 'user';
            userList.appendChild(li);

            li.addEventListener('click',(ev)=>{
                // clear old user info, show new user info
                if(document.querySelector('.userInfo') != null){
                    document.querySelector(`.userInfo`).remove();
                    const repos = document.querySelectorAll(`.repo`);
                    repos.forEach(rep=>rep.remove());
                }
                //^^^ clear repo list
                const userInfo = document.createElement('li');
                userInfo.className = 'userInfo';
                userInfo.innerHTML = `
                <a href=${devProfile}>${devName}'s Recent Repositories</a>
                `
                repoList.appendChild(userInfo);

                fetch(`https://api.github.com/users/${devName}/repos`).then(resp=>resp.json()).then(data=>{
                    // console.log(data);
                    for(const repo of data){

                        const repoLi = document.createElement('li');
                        repoLi.className=`repo`;
                        repoLi.innerHTML=`
                        <h3><a href=${repo[`html_url`]}>${repo[`name`]}</a></h3>
                        `
                        repoList.appendChild(repoLi);
                        console.log(`${repo[`name`]} has been added to the list`);
                    }
                }).catch(er=>console.log(`we had an error: ${er}`));
            })
        }
    }).catch((err)=>{
        console.log(`error: ${err}`);
    })
}
//