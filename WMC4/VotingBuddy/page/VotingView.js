import Topic from "./Topic.js";

export default function VotingView(votingModel) {
    this.votingModel = votingModel;
    this.topicInput = document.getElementById('topicInput');
    this.createTopicBtn = document.getElementById('createTopicBtn');
}

VotingView.prototype.bind = function() {
    this.createTopicBtn.addEventListener('click', () => {
        this.votingModel.addTopic(new Topic(this.topicInput.value, this.topicInput.value, 0), () => this.render());
    }); 
}

VotingView.prototype.render = function() {
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    
    this.votingModel.sort();
    
    for(let topic of this.votingModel.topicList) {
        let tr = document.createElement('tr');
        tr.id = `${topic.id}`;

        let upvoteBtn = document.createElement('button');
        let downvoteBtn = document.createElement('button');
        upvoteBtn.id = `${topic.id}-upvote`;
        downvoteBtn.id = `${topic.id}-downvote`;
        upvoteBtn.type = 'button';
        downvoteBtn.type = 'button';
        upvoteBtn.className = 'btn btn-danger';
        downvoteBtn.className = 'btn btn-primary';
        upvoteBtn.innerHTML = '<i class="fa-solid fa-circle-up"></i>';
        downvoteBtn.innerHTML = '<i class="fa-solid fa-circle-down"></i>';
        
        upvoteBtn.addEventListener('click', () => {
            this.votingModel.voteUp(tr.id);
            this.render();
        });
        downvoteBtn.addEventListener('click', () => {
            this.votingModel.voteDown(tr.id);
            this.render();
        });

        tr.innerHTML = `<td class="center">${topic.votes}</td>
                        <td>${topic.title}</td>`;

        let tdUpvoteBtn = document.createElement('td');
        let tdDownvoteBtn = document.createElement('td');
        tdUpvoteBtn.append(upvoteBtn);
        tdDownvoteBtn.append(downvoteBtn);
        tr.append(tdUpvoteBtn);
        tr.appendChild(tdDownvoteBtn);

        tbody.append(tr);
    }

    VotingView.prototype.init = function() {
        this.reload();
    }

    VotingView.prototype.reload = function() {
        this.votingModel.loadTopics(() => this.render);
    }
}