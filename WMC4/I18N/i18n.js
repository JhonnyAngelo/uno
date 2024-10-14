export default function I18N(lang) {
    this.lang = lang;
    this.translations = {
        'en': {
            'hello': 'Hello $0, nice to see you!',
            'time': 'The time is: $1',
            'niceday': 'Have a nice day!'
        },
        'it': {
            'hello': 'Ciao $0, che bello vederdi!',
            'time': "L'ora è: $1",
            'niceday': 'Buona giornata!'
        }
    };
}

I18N.prototype.translate = function(key, args) {
    let message = this.translations[this.lang][key];

    if(message) {
        if(key == 'time')
            console.log(args.length);

        for(let i = 0; i < args.length; i++) {
            message = message.replace(`\$${i}`, args[i]);
        }
        return message;
    }

    return null;
}

I18N.prototype.setLanguage = function(lang) {
    this.lang = lang;
}