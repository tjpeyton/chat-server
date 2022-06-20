const colorList = ["black", "red", "yellow", "blue", "magenta", "cyan", "white", "gray", "grey"];
const help = 
`
*****Available Commands*****

Change your name
/name <arg>

Display current chat user count
/userc

Display list of connected users
/users

Chnage your name color
/color <arg>

Send a private message
Preface your message with /private
/private <targetUserName> <message>

Avaliable colors
`;
const colorString = "black ".bgWhite.black + "red ".red + "yellow ".yellow + "blue ".blue + "magenta ".magenta + "cyan ".cyan + "white ".white +"gray ".gray + "grey ".grey;
const helpFinal = help + colorString;
const stars = "****************************";

module.exports = {
  colorList,
  helpFinal,
  stars
}
