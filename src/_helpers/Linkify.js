import React from "react";
import LinkifyIt from "linkify-it";

const linkify = new LinkifyIt();

linkify.add("@", {
  validate: function(text, pos, self) {
    let tail = text.slice(pos);

    if (!self.re.prinzio) {
      self.re.prinzio = new RegExp("([(.*?)]()(.+?)())");
    }

    if (self.re.prinzio.test(tail)) {
      // Linkifier allows punctuation chars before prefix,
      // but we additionally disable `@` ("@@mention" is invalid)
      if (pos >= 2 && tail[pos - 2] === "@") {
        return false;
      }
      return tail.match(self.re.prinzio)[0].length;
    }
    return 0;
  },
  normalize: function(match) {
    console.log(match);
    match.url = "https://sherly.prinzio.com/" + match.url.replace(/^@/, "");
  }
});

class Linkify extends React.Component {
  parse(children) {
    // console.log(linkify.match(children));
  }

  render() {
    this.parse(this.props.children);
    return null;
  }
}


const mapDispatchToProps = {

};

export default linkify;