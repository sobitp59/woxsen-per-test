import { IATestQuestion } from "../lib/inferential-test";

// Define the structure of our questions
export const inferentialAbilityQuestions: IATestQuestion[] = [
  {
    no: 1,
    text: "A man fell in love with a woman who worked as a sex worker. They had a baby girl together, though they never married legally. One day, the woman ran away with another man, leaving the baby in the care of her father. The man provided all the necessary luxuries and raised his daughter with love and care. As she grew up, she blossomed into a beautiful woman. When she turned 18, the man fell in love with her and proposed to her. What is your opinion on the event of them becoming a couple?",
    options: [
    {answer:"No, it was completely morally inappropriate.",score:1},
    {answer: "No, it goes against societal norms and values.",score:2},
    {answer:"Yes, legally if both are consenting adults.",score:4},
    {answer:"Yes, their love transcends conventional norms.",score:3}
    ],
  },
  {
    no: 2,
    text: "In a small Indian village, Hari's wife, Priya, fell gravely ill with cancer. The only medicine that could save her was made by a local healer, Mr. Rao, who charged ₹2000. Hari, a poor farmer, could only raise ₹500. Desperate, he asked Mr. Rao to lower the price or accept instalments, but Mr. Rao refused. With no other options, Hari broke into Mr. Rao's clinic at night and stole the medicine to save Priya's life. The next day, the village learned of the theft and debated whether Hari's actions were justified.",
    options: [
      {answer:"Yes, Hari was justified: Saving Priya’s life is more important than the cost of the medicine.",score:2},
      {answer:"No, Hari was not justified: Stealing is illegal and undermines societal rules.",score:1},
      {answer:"Maybe, under certain conditions:  While legally wrong, the moral implications of saving a life might outweigh the act of theft.",score:3}
    ]
  },
  {
    no: 3,
    text: "Rajesh, a middle-class man whose modest job as a clerk at a local office paid just enough to cover household expenses, leaving little room for luxuries, stumbled upon a leather bag one evening in a quiet alley of Ramnagar. Inside, he found 11,000 rupees neatly bundled. Shocked and conflicted, he wrestled with the decision of what to do with the unexpected windfall. His mind raced with many thoughts as he stood there, contemplating his next move.",
    options: [
      {answer:"He should keep all the money for himself, leading a more luxurious life.",score:1},
      {answer:"He should keep half for luxuries and use the other half to feed slum children.",score:2},
      {answer:"He should donate all the money to the temple for the community.",score:3},
      {answer:"He should return all the money to the police station, ensuring it reaches its rightful owner.",score:4}
    ]
  },
  {
    no: 4,
    text: "There were two children, both aged 12 and very close friends. One was the son of a wealthy man, whose mother had passed away. The other was the son of a house helper in the same household. The wealthy father often praised the helper's son, who was now an orphan, while sometimes neglecting his own son. Out of jealousy, the wealthy man's son stole money and gold from his own home and framed the orphaned child. As a result, the wealthy father threw the orphaned child out of the house. Was the rich child’s behaviour justified?",
    options: [
      {answer:"No, it was morally wrong, he shouldn’t have betrayed his friend.",score:1},
      {answer:"The child should confess his mistake and ask the father for forgiveness.",score:3},
      {answer:"Yes, considering the impulsivity was the consequence of jealousy.",score:2}
    ]
  },
  {
    no: 5,
    text: 'One day, Ravi was walking through the market with his mother, celebrating his achievement of distinction in the 9th grade. Amid the bustling crowd, he spotted Meena, their house-helper, busy buying vegetables. Overwhelmed with joy, Ravi approached her and respectfully touched her feet, seeking her blessings. "I got a distinction," he said excitedly. His mother witnessed the scene. How should she have reacted in this situation?',
    options: [
      {answer:"His mother should be proud of him and smiled at him.",score:4},
      {answer:"His mother should have scolded him in front of others in the market.",score:1},
      {answer:"His mother should not have said anything at the time and scolded him when they reached home.",score:3},
      {answer:"His mother understood and softly said, 'Please don't do that again. We shouldn't touch someone's feet in the open market.",score:2}
    ]
  }
];