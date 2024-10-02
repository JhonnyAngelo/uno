import VotingDao from "./VotingDao.js";

export default function VotingModel(baseurl) {
    this.topicList = [];
    this.dao = new VotingDao(baseurl);
}

VotingModel.prototype.addTopic = function(topic, callback) {
    if(topic && this.getTopicByTitle(topic.title) == null) {
        this.topicList.push(topic);
        this.dao.add(topic, callback);
    }
}

VotingModel.prototype.voteUp = function(topicId, callback) {
    let topic = this.getTopicById(topicId);
    if(topic) {
        topic.votes++;
        this.dao.update(topic, callback);
        localStorage.setItem(topic.id, "voted");
    }
}

VotingModel.prototype.voteDown = function(topicId, callback) {
    let topic = this.getTopicById(topicId);
    
    if(topic) {
        topic.votes--;
        this.dao.update(topic, callback);
        localStorage.setItem(topic.id, "voted");
    }
}

VotingModel.prototype.sort = function() {
    for(let i = 0; i < this.topicList.length; i++) {
        for(let j = 0; j < this.topicList.length-1; j++) {
            if(this.topicList[j].votes < this.topicList[j+1].votes) {

                let tempTopic = this.topicList[j];
                this.topicList[j] = this.topicList[j+1];
                this.topicList[j+1] = tempTopic;
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

VotingModel.prototype.getTopicByTitle = function(topicTitle) {
    for(let topic of this.topicList) {
        if(topic.title == topicTitle) {
            return topic;
        }
    }
    return null;
}

VotingModel.prototype.loadTopics = function(renderCallback) {
    this.dao.load((response) => {
        
        this.topicList = response;
        renderCallback();
    });
}