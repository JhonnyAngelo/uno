export default function VotingModel(baseurl) {
    this.topicList = [];
    this.dao = new VotingModel(baseurl);
}

VotingModel.prototype.addTopic = function(topic, callback) {
    if(topic && this.getTopicById(topic.id) == null) {
        this.topicList.push(topic);
        console.log(this.topicList);
        callback();
    }
}

VotingModel.prototype.voteUp = function(topicId) {
    let topic = this.getTopicById(topicId);
    topic.votes++;
}

VotingModel.prototype.voteDown = function(topicId) {
    let topic = this.getTopicById(topicId);
    topic.votes--;
}

VotingModel.prototype.sort = function() {
    for(let i = 0; i < this.topicList; i++) {
        for(let j = 0; j < this.topicList-1; j++) {
            if(this.topicList[i].votes < this.topicList[i+1].votes) {
                let tempTopic = this.topicList[i];
                this.topicList[i] = this.topicList[i+1];
                this.topicList[i+1] = tempTopic;
            }
        }
    }
}

VotingModel.prototype.getTopicById = function(topicId) {
    for(let topic of this.topicList) {
        if(topic.id == topicId) {
            return topic;
        }
    }
    return null;
}

VotingModel.prototype.loadTopics = function(renderCallback) {
    this.dao.loadTopics(() => {
        
        this.topicList = [];
        for(let topic of this.topicList)
            this.topicList.add(topic);

        renderCallback();
    });
}