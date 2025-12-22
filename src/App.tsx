import logo from "./assets/logo.png";
import Header from "./components/Header";
import { useState, useEffect } from "react";
import {
    BookOpen,
    Award,
    CheckCircle,
    Edit2,
    Save,
    X,
    Clock,
    Plus,
    Lock,
    Unlock,
} from "lucide-react";

interface PaystackResponse {
    reference: string;
    status: string;
    message: string;
    trans: string;
    transaction: string;
    trxref: string;
}

declare global {
    interface Window {
        PaystackPop: {
            setup: (config: {
                key: string;
                email: string;
                amount: number;
                currency: string;
                reference: string;
                onClose: () => void;
                callback: (response: PaystackResponse) => void;
            }) => { openIframe: () => void };
        };
    }
}

type BibleVersions = {
    KJV: string;
    NKJV: string;
    NIV: string;
    ESV: string;
    AMP: string;
    NLT: string;
};

type ScriptureDB = Record<string, BibleVersions>;

// const initialScriptureDB: ScriptureDB = {
//         "Mark 3:27": {
//             KJV: "27 No man can enter into a strong man's house, and spoil his goods, except he will first bind the strong man; and then he will spoil his house.",
//             NKJV: "27 No one can enter a strong man’s house and plunder his goods, unless he first binds the strong man. And then he will plunder his house.",
//             NIV: "27 In fact, no one can enter a strong man’s house without first tying him up. Then he can plunder the strong man’s house.",
//             ESV: "27 But no one can enter a strong man's house and plunder his goods, unless he first binds the strong man. Then indeed he may plunder his house.",
//             AMP: "27 But no one can enter a strong man’s house and plunder his property unless he first binds the strong man; then he will plunder his house.",
//             NLT: "27 Let me illustrate this further. Who is powerful enough to enter the house of a strong man and plunder his goods? Only someone even stronger—someone who could tie him up and then plunder his house."
//         },
//         "Romans 13:1-5": {
//             KJV: "1 Let every soul be subject unto the higher powers. For there is no power but of God: the powers that be are ordained of God. 2 Whosoever therefore resisteth the power, resisteth the ordinance of God: and they that resist shall receive to themselves damnation. 3 For rulers are not a terror to good works, but to the evil. Wilt thou then not be afraid of the power? do that which is good, and thou shalt have praise of the same. 4 For he is the minister of God to thee for good. But if thou do that which is evil, be afraid; for he beareth not the sword in vain: for he is the minister of God, a revenger to execute wrath upon him that doeth evil. 5 Wherefore ye must needs be subject, not only for wrath, but also for conscience sake.",
//             NKJV: "1 Let every soul be subject to the governing authorities. For there is no authority except from God, and the authorities that exist are appointed by God. 2 Therefore whoever resists the authority resists the ordinance of God, and those who resist will bring judgment on themselves. 3 For rulers are not a terror to good works, but to evil. Do you want to be unafraid of the authority? Do what is good, and you will have praise from the same. 4 For he is God's minister to you for good. But if you do evil, be afraid; for he does not bear the sword in vain; for he is God's minister, an avenger to execute wrath on him who practices evil. 5 Therefore you must be subject, not only because of wrath but also for conscience' sake.",
//             NIV: "1 Let everyone be subject to the governing authorities, for there is no authority except that which God has established. The authorities that exist have been established by God. 2 Consequently, whoever rebels against the authority is rebelling against what God has instituted, and those who do so will bring judgment on themselves. 3 For rulers hold no terror for those who do right, but for those who do wrong. Do you want to be free from fear of the one in authority? Then do what is right and you will be commended. 4 For the one in authority is God’s servant for your good. But if you do wrong, be afraid, for rulers do not bear the sword for no reason. They are God’s servants, agents of wrath to bring punishment on the wrongdoer. 5 Therefore, it is necessary to submit to the authorities, not only because of possible punishment but also as a matter of conscience.",
//             ESV: "1 Let every person be subject to the governing authorities. For there is no authority except from God, and those that exist have been instituted by God. 2 Therefore whoever resists the authorities resists what God has appointed, and those who resist will incur judgment. 3 For rulers are not a terror to good conduct, but to bad. Would you have no fear of the one who is in authority? Then do what is good, and you will receive his approval, 4 for he is God’s servant for your good. But if you do wrong, be afraid, for he does not bear the sword in vain. For he is the servant of God, an avenger who carries out God’s wrath on the wrongdoer. 5 Therefore one must be in subjection, not only to avoid God’s wrath but also for the sake of conscience.",
//             AMP: "1 Let every person be in subjection to the governing authorities, for there is no authority except from God, and the authorities that exist are appointed by God. 2 Therefore whoever resists authority is resisting what God has appointed, and those who resist will bring judgment on themselves. 3 For rulers are not a terror to those who do good, but to those who do evil. Would you like to be unafraid of the authority? Do what is good, and you will have approval. 4 For the one in authority is God’s servant for your good. But if you do evil, be afraid, for he does not bear the sword in vain; he is God’s servant, an agent of wrath to bring punishment on the wrongdoer. 5 Therefore, you must be in subjection, not only because of wrath but also for conscience’ sake.",
//             NLT: "1 Everyone must submit to governing authorities. For all authority comes from God, and those in positions of power have been placed there by God. 2 So anyone who rebels against authority is rebelling against what God has instituted, and they will be punished. 3 For the authorities do not strike fear in people who are doing right, but in those who are doing wrong. Would you like to live free from fear of the authorities? Then do what is right, and they will honor you. 4 The authorities are God’s servants, sent for your good. But if you do wrong, you should be afraid, for they have the power to punish you. They are God’s servants, sent for the very purpose of punishing those who do evil. 5 So you must submit to them, not only to avoid punishment, but also to keep your conscience clear."
//         },
//         "Genesis 2:15-17": {
//             KJV: "15 And the Lord God took the man, and put him into the garden of Eden to dress it and to keep it. 16 And the Lord God commanded the man, saying, Of every tree of the garden thou mayest freely eat: 17 But of the tree of the knowledge of good and evil, thou shalt not eat of it: for in the day that thou eatest thereof thou shalt surely die.",
//             NKJV: "15 Then the Lord God took the man and put him in the garden of Eden to tend and keep it. 16 And the Lord God commanded the man, saying, 'Of every tree of the garden you may freely eat; 17 but of the tree of the knowledge of good and evil you shall not eat, for in the day that you eat of it you shall surely die.'",
//             NIV: "15 The Lord God took the man and put him in the Garden of Eden to work it and take care of it. 16 And the Lord God commanded the man, 'You are free to eat from any tree in the garden; 17 but you must not eat from the tree of the knowledge of good and evil, for when you eat from it you will certainly die.'",
//             ESV: "15 The Lord God took the man and put him in the garden of Eden to work it and keep it. 16 And the Lord God commanded the man, saying, 'You may surely eat of every tree of the garden, 17 but of the tree of the knowledge of good and evil you shall not eat, for in the day that you eat of it you shall surely die.'",
//             AMP: "15 So the Lord God took the man [He had made] and settled him in the Garden of Eden to cultivate and keep it. 16 And the Lord God commanded the man, saying, 'You may freely (unconditionally) eat the fruit from every tree of the garden; 17 but [only] from the tree of the knowledge (recognition) of good and evil you shall not eat, otherwise on the day that you eat from it, you shall most certainly die [because of your disobedience].'",
//             NLT: "15 The Lord God placed the man in the Garden of Eden to tend and watch over it. 16 But the Lord God warned him, 'You may freely eat the fruit of every tree in the garden— 17 except the tree of the knowledge of good and evil. If you eat its fruit, you are sure to die.'"
//         },
//         "Exodus 2:24": {
//             KJV: "24 And God heard their groaning, and God remembered his covenant with Abraham, with Isaac, and with Jacob.",
//             NKJV: "24 And God heard their groaning, and God remembered His covenant with Abraham, with Isaac, and with Jacob.",
//             NIV: "24 God heard their groaning and remembered his covenant with Abraham, with Isaac, and with Jacob.",
//             ESV: "24 And God heard their groaning, and God remembered his covenant with Abraham, with Isaac, and with Jacob.",
//             AMP: "24 And God heard their groaning, and God remembered His covenant with Abraham, Isaac, and Jacob.",
//             NLT: "24 God heard the people of Israel groaning, and he remembered his covenant with Abraham, Isaac, and Jacob."
//         },

//         "Genesis 9:13-17": {
//             "KJV": "13 I do set my bow in the cloud, and it shall be for a token of a covenant between me and the earth. 14 And it shall come to pass, when I bring a cloud over the earth, that the bow shall be seen in the cloud: 15 And I will remember my covenant, which is between me and you and every living creature of all flesh; and the waters shall no more become a flood to destroy all flesh. 16 And the bow shall be in the cloud; and I will look upon it, that I may remember the everlasting covenant between God and every living creature of all flesh that is upon the earth. 17 And God said unto Noah, This is the token of the covenant, which I have established between me and all flesh that is upon the earth.",
//             "NKJV": "13 I set My rainbow in the cloud, and it shall be for a sign of a covenant between Me and the earth. 14 It shall be, when I bring a cloud over the earth, that the rainbow shall be seen in the cloud; 15 and I will remember My covenant which is between Me and you and every living creature of all flesh; the waters shall never again become a flood to destroy all flesh. 16 The rainbow shall be in the cloud, and I will look on it to remember the everlasting covenant between God and every living creature of all flesh that is on the earth. 17 And God said to Noah, 'This is the sign of the covenant which I have established between Me and all flesh that is on the earth.'",
//             "NIV": "13 I have set my bow in the clouds, and it will be the sign of the covenant between me and the earth. 14 Whenever I bring clouds over the earth and the rainbow appears in the clouds, 15 I will remember my covenant between me and you and all living creatures of every kind. Never again will the waters become a flood to destroy all life. 16 Whenever the rainbow appears in the clouds, I will see it and remember the everlasting covenant between God and all living creatures of every kind on the earth.' 17 So God said to Noah, 'This is the sign of the covenant I have established between me and all life on the earth.'",
//             "ESV": "13 I have set my bow in the cloud, and it shall be a sign of the covenant between me and the earth. 14 When I bring clouds over the earth and the bow is seen in the clouds, 15 I will remember my covenant that is between me and you and every living creature of all flesh. And the waters shall never again become a flood to destroy all flesh. 16 When the bow is in the clouds, I will see it and remember the everlasting covenant between God and every living creature of all flesh that is on the earth. 17 God said to Noah, 'This is the sign of the covenant that I have established between me and all flesh that is on the earth.'",
//             "AMP": "13 I set My rainbow (sign of the covenant) in the cloud, and it shall be a token or sign of a covenant between Me and the earth. 14 And it shall come to pass, when I bring clouds over the earth, that the rainbow shall be seen in the cloud, 15 And I will remember My covenant, which is between Me and you and every living creature of all flesh; and the waters shall no more become a flood to destroy all flesh. 16 And the bow shall be in the cloud; and I will look upon it, that I may remember the everlasting covenant between God and every living creature of all flesh that is upon the earth. 17 And God said to Noah, 'This is the token or sign of the covenant which I have established between Me and all flesh that is upon the earth.'",
//             "NLT": "13 I have placed my rainbow in the clouds. It is the sign of my covenant with you and with all the earth. 14 When I send clouds over the earth, the rainbow will appear in the clouds. 15 Then I will remember my covenant with you and with all living creatures. The water will never again become a flood to destroy all life. 16 When I see the rainbow in the clouds, I will remember the eternal covenant between God and every living creature on earth.' 17 Then God told Noah, 'Yes, this is the sign of the covenant I am confirming with all the creatures on earth.'"
//         },

//         "Genesis 28:22": {
//             "KJV": "And this stone, which I have set for a pillar, shall be God's house: and of all that thou shalt give me I will surely give the tenth unto thee.",
//             "NKJV": "and this stone which I have set as a pillar shall be God's house, and of all that You give me I will surely give a tenth to You.",
//             "NIV": "and this stone that I have set up as a pillar will be God’s house, and of all that you give me I will give you a tenth.”",
//             "ESV": "and this stone, which I have set up as a pillar, shall be God’s house, and of all that you give me I will surely give a tenth to you.”",
//             "AMP": "This stone which I have set up as a pillar (monument, memorial) will be God’s house [a sacred place to me], and of everything that You give me I will give the tenth to You [as an offering to signify my gratitude and dependence on You].’",
//             "NLT": "And this memorial pillar I have set up will become a place for worshiping God, and I will present to God a tenth of everything he gives me.”"
//         },

//         "Genesis 9:8-9": {
//             KJV: "8 And God spake unto Noah, and to his sons with him, saying, 9 And I, behold, I establish my covenant with you, and with your seed after you;",
//             NKJV: "8 Then God spoke to Noah and to his sons with him, saying: 9 'And as for Me, behold, I establish My covenant with you and with your descendants after you,'",
//             NIV: "8 Then God said to Noah and to his sons with him: 9 'I now establish my covenant with you and with your descendants after you,'",
//             ESV: "8 Then God said to Noah and to his sons with him, 9 'Behold, I establish my covenant with you and your offspring after you,'",
//             AMP: "8 Then God spoke to Noah and to his sons with him, saying, 9 'Now behold, I am establishing My covenant with you and with your descendants after you,'",
//             NLT: "8 Then God told Noah and his sons, 9 'I hereby confirm my covenant with you and your descendants,'"
//         },
//         "Genesis 17:9": {
//             KJV: "9 And God said unto Abraham, Thou shalt keep my covenant therefore, thou, and thy seed after thee in their generations.",
//             NKJV: "9 And God said to Abraham: 'As for you, you shall keep My covenant, you and your descendants after you throughout their generations.'",
//             NIV: "9 Then God said to Abraham, 'As for you, you must keep my covenant, you and your descendants after you for the generations to come.'",
//             ESV: "9 And God said to Abraham, 'As for you, you shall keep my covenant, you and your offspring after you throughout their generations.'",
//             AMP: "9 God said further to Abraham, 'As for you, you shall keep My covenant, you and your descendants after you throughout their generations.'",
//             NLT: "9 Then God said to Abraham, 'Your responsibility is to obey the terms of the covenant. You and all your descendants have this continual responsibility.'"
//         },
//         "Genesis 17:19": {
//             KJV: "19 And God said, Sarah thy wife shall bear thee a son indeed; and thou shalt call his name Isaac: and I will establish my covenant with him for an everlasting covenant, and with his seed after him.",
//             NKJV: "19 Then God said: 'No, Sarah your wife shall bear you a son, and you shall call his name Isaac; I will establish My covenant with him for an everlasting covenant, and with his descendants after him.'",
//             NIV: "19 Then God said, 'Yes, but your wife Sarah will bear you a son, and you will call him Isaac. I will establish my covenant with him as an everlasting covenant for his descendants after him.'",
//             ESV: "19 God said, 'No, but Sarah your wife shall bear you a son, and you shall call his name Isaac. I will establish my covenant with him as an everlasting covenant for his offspring after him.'",
//             AMP: "19 But God said, 'No; Sarah your wife will bear you a son indeed, and you shall name him Isaac; and I will establish My covenant with him for an everlasting covenant, for his descendants after him.'",
//             NLT: "19 But God replied, 'No—Sarah, your wife, will give birth to a son for you. You will name him Isaac, and I will confirm my covenant with him and his descendants as an everlasting covenant.'"
//         },
//         "Exodus 24:6-8": {
//             KJV: "6 And Moses took half of the blood, and put it in basons; and half of the blood he sprinkled on the altar. 7 And he took the book of the covenant, and read in the audience of the people: and they said, All that the Lord hath said will we do, and be obedient. 8 And Moses took the blood, and sprinkled it on the people, and said, Behold the blood of the covenant, which the Lord hath made with you concerning all these words.",
//             NKJV: "6 And Moses took half the blood and put it in basins, and half the blood he sprinkled on the altar. 7 Then he took the Book of the Covenant and read in the hearing of the people. And they said, 'All that the Lord has said we will do, and be obedient.' 8 And Moses took the blood, sprinkled it on the people, and said, 'This is the blood of the covenant which the Lord has made with you according to all these words.'",
//             NIV: "6 Moses took half of the blood and put it in bowls, and the other half he splashed against the altar. 7 Then he took the Book of the Covenant and read it to the people. They responded, 'We will do everything the Lord has said; we will obey.' 8 Moses then took the blood, sprinkled it on the people and said, 'This is the blood of the covenant that the Lord has made with you in accordance with all these words.'",
//             ESV: "6 And Moses took half of the blood and put it in basins, and half of the blood he threw against the altar. 7 Then he took the Book of the Covenant and read it in the hearing of the people. And they said, 'All that the Lord has spoken we will do, and we will be obedient.' 8 And Moses took the blood and threw it on the people and said, 'Behold the blood of the covenant that the Lord has made with you in accordance with all these words.'",
//             AMP: "6 Moses took half of the blood and put it in basins, and the other half of the blood he sprinkled on the altar. 7 Then he took the Book of the Covenant and read it in the hearing of the people, and they said, 'All that the Lord has spoken we will do, and we will be obedient.' 8 So Moses took the blood and sprinkled it on the people, and said, 'Behold the blood of the covenant which the Lord has made with you in accordance with all these words.'",
//             NLT: "6 Moses drained half the blood from these animals into basins. The other half he splattered against the altar. 7 Then he took the Book of the Covenant and read it aloud to the people. Again they all responded, 'We will do everything the Lord has commanded. We will obey.' 8 Then Moses took the blood from the basins and splattered it over the people, declaring, 'Look, this blood confirms the covenant the Lord has made with you in giving you these instructions.'"
//         },

//         "Joshua 9:14-19": {
//             KJV: "14 And the men took of their victuals, and asked not counsel at the mouth of the Lord. 15 And Joshua made peace with them, and made a league with them, to let them live: and the princes of the congregation sware unto them. 16 And it came to pass at the end of three days after they had made a league with them, that they heard that they were their neighbours, and that they dwelt among them. 17 And the children of Israel journeyed, and came unto their cities on the third day. Now their cities were Gibeon, and Chephirah, and Beeroth, and Kirjathjearim. 18 And the children of Israel smote them not, because the princes of the congregation had sworn unto them by the Lord God of Israel. And all the congregation murmured against the princes. 19 But all the princes said unto all the congregation, We have sworn unto them by the Lord God of Israel: now therefore we may not touch them.",
//             NKJV: "14 Then the men of Israel took some of their provisions; but they did not ask counsel of the Lord. 15 So Joshua made peace with them, and made a covenant with them to let them live; and the rulers of the congregation swore to them. 16 And it happened at the end of three days, after they had made a covenant with them, that they heard that they were their neighbors who dwelt near them. 17 Then the children of Israel journeyed and came to their cities on the third day. Now their cities were Gibeon, Chephirah, Beeroth, and Kirjath Jearim. 18 But the children of Israel did not attack them, because the rulers of the congregation had sworn to them by the Lord God of Israel. And all the congregation complained against the rulers. 19 Then all the rulers said to all the congregation, 'We have sworn to them by the Lord God of Israel; now therefore, we may not touch them.'",
//             NIV: "14 The Israelites sampled their provisions but did not inquire of the Lord. 15 Then Joshua made a treaty of peace with them to let them live, and the leaders of the assembly ratified it by oath. 16 Three days after they made the treaty with the Gibeonites, the Israelites heard that they were neighbors, living near them. 17 So the Israelites set out and on the third day came to their cities: Gibeon, Kephirah, Beeroth and Kiriath Jearim. 18 But the Israelites did not attack them, because the leaders of the assembly had sworn an oath to them by the Lord, the God of Israel. The whole assembly grumbled against the leaders. 19 But all the leaders answered, 'We have given them our oath by the Lord, the God of Israel, and we cannot touch them now.'",
//             ESV: "14 So the men took some of their provisions, but did not ask counsel from the Lord. 15 And Joshua made peace with them and made a covenant with them, to let them live, and the leaders of the congregation swore to them. 16 But at the end of three days after they had made a covenant with them, they heard that they were their neighbors and that they lived among them. 17 And the people of Israel set out and reached their cities on the third day. Now their cities were Gibeon, Chephirah, Beeroth, and Kiriath-jearim. 18 But the people of Israel did not attack them, because the leaders of the congregation had sworn to them by the Lord, the God of Israel. Then all the congregation murmured against the leaders. 19 But all the leaders said to all the congregation, 'We have sworn to them by the Lord, the God of Israel, and now we may not touch them.'",
//             AMP: "14 So the men [of Israel] took some of their own provisions [and offered them in friendship], and did not ask for the counsel of the Lord. 15 Joshua made peace with them and made a covenant with them, to let them live, and the leaders of the congregation swore an oath to them. 16 It happened that after they had made a covenant with them, they heard that they were actually their neighbors and lived among them. 17 Then the sons of Israel set out and came to their cities on the third day. Now their cities were Gibeon, Chephirah, Beeroth, and Kiriath-jearim. 18 The sons of Israel did not kill them because the leaders of the congregation had sworn an oath to them by the Lord, the God of Israel. And all the congregation murmured against the leaders. 19 But all the leaders said to all the congregation, 'We have sworn an oath to them by the Lord, the God of Israel, and now we cannot touch them.'",
//             NLT: "14 So the Israelites examined their food, but they did not consult the Lord. 15 Then Joshua made a peace treaty with them and guaranteed their safety, and the leaders of the community ratified their agreement with a binding oath. 16 Three days after making the treaty, they learned that these people actually lived nearby! 17 The Israelites set out at once to investigate and reached their towns in three days. The towns were Gibeon, Kephirah, Beeroth, and Kiriath-jearim. 18 But the Israelites did not attack the towns, for the Israelite leaders had made a vow to them in the name of the Lord, the God of Israel. The people of Israel grumbled against the leaders because of the treaty. 19 But the leaders replied, 'Since we have sworn an oath in the presence of the Lord, the God of Israel, we cannot touch them.'"
//         },
//         "2 Samuel 21:1-9": {
//             KJV: "1 Then there was a famine in the days of David three years, year after year; and David enquired of the Lord. And the Lord answered, It is for Saul, and for his bloody house, because he slew the Gibeonites. 2 And the king called the Gibeonites, and said unto them; (now the Gibeonites were not of the children of Israel, but of the remnant of the Amorites; and the children of Israel had sworn unto them: and Saul sought to slay them in his zeal to the children of Israel and Judah.) 3 Wherefore David said unto the Gibeonites, What shall I do for you? and wherewith shall I make the atonement, that ye may bless the inheritance of the Lord? 4 And the Gibeonites said unto him, We will have no silver nor gold of Saul, nor of his house; neither for us shalt thou kill any man in Israel. And he said, What ye shall say, that will I do for you. 5 And they answered the king, The man that consumed us, and that devised against us that we should be destroyed from remaining in any of the coasts of Israel, 6 Let seven men of his sons be delivered unto us, and we will hang them up unto the Lord in Gibeah of Saul, whom the Lord did choose. And the king said, I will give them. 7 But the king spared Mephibosheth, the son of Jonathan the son of Saul, because of the Lord's oath that was between them, between David and Jonathan the son of Saul. 8 But the king took the two sons of Rizpah the daughter of Aiah, whom she bare unto Saul, Armoni and Mephibosheth; and the five sons of Michal the daughter of Saul, whom she brought up for Adriel the son of Barzillai the Meholathite: 9 And he delivered them into the hands of the Gibeonites, and they hanged them in the hill before the Lord: and they fell all seven together, and were put to death in the days of harvest, in the first days, in the beginning of barley harvest.",
//             NKJV: "1 Now there was a famine in the days of David for three years, year after year; and David inquired of the Lord. And the Lord answered, 'It is because of Saul and his bloodthirsty house, because he killed the Gibeonites.' 2 So the king called the Gibeonites and spoke to them. (Now the Gibeonites were not of the children of Israel, but of the remnant of the Amorites; the children of Israel had sworn protection to them, but Saul had sought to kill them in his zeal for the children of Israel and Judah.) 3 Therefore David said to the Gibeonites, 'What shall I do for you? And with what shall I make atonement, that you may bless the inheritance of the Lord?' 4 And the Gibeonites said to him, 'We will have no silver or gold from Saul or from his house, nor shall you kill any man in Israel for us.' So he said, 'Whatever you say, I will do for you.' 5 Then they answered the king, 'As for the man who consumed us and plotted against us, that we should be destroyed from remaining in any of the territories of Israel, 6 let seven men of his descendants be delivered to us, and we will hang them before the Lord in Gibeah of Saul, whom the Lord chose.' And the king said, 'I will give them.' 7 But the king spared Mephibosheth the son of Jonathan, the son of Saul, because of the Lord’s oath that was between them, between David and Jonathan the son of Saul. 8 So the king took Armoni and Mephibosheth, the two sons of Rizpah the daughter of Aiah, whom she bore to Saul, and the five sons of Michal the daughter of Saul, whom she brought up for Adriel the son of Barzillai the Meholathite; 9 and he delivered them into the hands of the Gibeonites, and they hanged them on the hill before the Lord. So they fell, all seven together, and were put to death in the days of harvest, in the first days, in the beginning of barley harvest.",
//             NIV: "1 During the reign of David, there was a famine for three successive years; so David sought the face of the Lord. The Lord said, 'It is on account of Saul and his blood-stained house; it is because he put the Gibeonites to death.' 2 The king summoned the Gibeonites and spoke to them. (Now the Gibeonites were not Israelites, but a remnant of the Amorites; the Israelites had sworn to spare them, but Saul in his zeal for Israel and Judah had tried to annihilate them.) 3 David asked the Gibeonites, 'What shall I do for you? How shall I make atonement so that you will bless the Lord’s inheritance?' 4 The Gibeonites answered him, 'We have no right to demand silver or gold from Saul or his family, nor do we have the right to put anyone in Israel to death.' 'What do you want me to do for you?' David asked. 5 They answered the king, 'As for the man who destroyed us and plotted against us so that we have been decimated and have no place anywhere in Israel, 6 let seven of his male descendants be given to us to be killed and exposed before the Lord at Gibeah of Saul—the Lord’s chosen one.' So the king said, 'I will give them.' 7 The king spared Mephibosheth son of Jonathan, the son of Saul, because of the oath before the Lord between David and Jonathan son of Saul. 8 But the king took Armoni and Mephibosheth, the two sons of Rizpah daughter of Aiah, whom she had borne to Saul, together with the five sons of Saul’s daughter Merab, whom she had borne to Adriel son of Barzillai the Meholathite. 9 He handed them over to the Gibeonites, who killed them and exposed them on a hill before the Lord. All seven of them fell together; they were put to death during the first days of the harvest, just as the barley harvest was beginning.",
//             ESV: "1 Now there was a famine in the days of David for three years, year after year. And David sought the face of the Lord. And the Lord said, 'There is bloodguilt on Saul and on his house, because he put the Gibeonites to death.' 2 So the king called the Gibeonites and spoke to them. Now the Gibeonites were not of the people of Israel but of the remnant of the Amorites. Although the people of Israel had sworn to spare them, Saul had sought to strike them down in his zeal for the people of Israel and Judah. 3 And David said to the Gibeonites, 'What shall I do for you? And how shall I make atonement, that you may bless the heritage of the Lord?' 4 The Gibeonites said to him, 'It is not a matter of silver or gold between us and Saul or his house; neither is it for us to put any man to death in Israel.' And he said, 'What do you say that I shall do for you?' 5 They said to the king, 'The man who consumed us and planned to destroy us, so that we should have no place in all the territory of Israel, 6 let seven of his sons be given to us, so that we may hang them before the Lord at Gibeah of Saul, the chosen of the Lord.' And the king said, 'I will give them.' 7 But the king spared Mephibosheth, the son of Jonathan, the son of Saul, because of the oath of the Lord that was between them, between David and Jonathan the son of Saul. 8 The king took the two sons of Rizpah the daughter of Aiah, whom she bore to Saul, Armoni and Mephibosheth, and the five sons of Merab the daughter of Saul, whom she bore to Adriel the son of Barzillai the Meholathite; 9 and he gave them into the hands of the Gibeonites, and they hanged them on the mountain before the Lord. And the seven of them perished together. They were put to death in the first days of harvest, at the beginning of barley harvest.",
//             AMP: "1 There was a three-year famine during the days of David, year after year; and David sought the face of the Lord. The Lord said, 'It is because of Saul and his bloody house, because he killed the Gibeonites.' 2 So the king called the Gibeonites and spoke to them. (Now the Gibeonites were not Israelites, but rather a remnant of the Amorites. The Israelites had sworn an oath to spare them, but Saul had sought to strike them down in his zeal for the people of Israel and Judah.) 3 So David said to the Gibeonites, 'What should I do for you? How can I make atonement so that you may bless the inheritance of the Lord?' 4 The Gibeonites said to him, 'We have no right to demand silver or gold from Saul or from his house, nor do we have the right to put any man in Israel to death.' David said, 'I will do for you whatever you say.' 5 They said to the king, 'The man who consumed us and planned to destroy us so that we would have no place anywhere in Israel, 6 let seven of his descendants be handed over to us so that we may hang them before the Lord in Gibeah of Saul, the chosen of the Lord.' And the king said, 'I will give them.' 7 But the king spared Mephibosheth the son of Jonathan, the son of Saul, because of the oath of the Lord that was between them, between David and Jonathan the son of Saul. 8 So the king took Armoni and Mephibosheth, the two sons of Rizpah daughter of Aiah, whom she bore to Saul, together with the five sons of Merab daughter of Saul, whom she bore to Adriel son of Barzillai the Meholathite. 9 He handed them over to the Gibeonites, and they hanged them on the mountain before the Lord; all seven of them fell together and were put to death in the first days of the harvest, at the beginning of the barley harvest.",
//             NLT: "1 There was a famine during David’s reign that lasted for three years, so David asked the Lord about it. And the Lord said, 'The famine has come because Saul and his family are guilty of murdering the Gibeonites.' 2 So the king summoned the Gibeonites. (They were not part of Israel but were all that was left of the nation of the Amorites. Israel had sworn not to kill them, but Saul, in his zeal for Israel and Judah, had tried to wipe them out.) 3 David asked them, 'What can I do for you? How can I make amends so that you will bless the Lord’s people again?' 4 'Well, money won’t do,' the Gibeonites replied. 'And we don’t want to see Israelites executed.' 'What can I do then?' David asked. 'Just tell me and I will do it for you.' 5 Then they replied, 'It was Saul who planned to destroy us, to keep us from having any place at all in the territory of Israel. 6 So let seven of Saul’s sons be handed over to us, and we will execute them before the Lord at Gibeah of Saul, the Lord’s chosen one.' 'All right,' the king said, 'I will do it.' 7 The king spared Mephibosheth, the grandson of Saul, because of the oath that David and Jonathan had sworn before the Lord. 8 But he gave them Saul’s two sons—Armoni and Mephibosheth, whose mother was Rizpah daughter of Aiah. He also gave them the five sons of Saul’s daughter Merab, the wife of Adriel son of Barzillai from Meholah. 9 The men of Gibeon executed them on the mountain before the Lord. So all seven of them died together at the beginning of the barley harvest."
//         },
//         "Deuteronomy 7:1-2": {
//             KJV: "1 When the Lord thy God shall bring thee into the land whither thou goest to possess it, and hath cast out many nations before thee, the Hittites, and the Girgashites, and the Amorites, and the Canaanites, and the Perizzites, and the Hivites, and the Jebusites, seven nations greater and mightier than thou; 2 And when the Lord thy God shall deliver them before thee; thou shalt smite them, and utterly destroy them; thou shalt make no covenant with them, nor shew mercy unto them:",
//             NKJV: "1 When the Lord your God brings you into the land which you go to possess, and has cast out many nations before you—the Hittites, the Girgashites, the Amorites, the Canaanites, the Perizzites, the Hivites, and the Jebusites, seven nations greater and mightier than you—2 and when the Lord your God delivers them over to you and you defeat them, you shall utterly destroy them. You shall make no covenant with them nor show mercy to them.",
//             NIV: "1 When the Lord your God brings you into the land you are entering to possess, and drives out before you many nations—the Hittites, Girgashites, Amorites, Canaanites, Perizzites, Hivites and Jebusites, seven nations larger and stronger than you—2 and when the Lord your God has delivered them over to you and you have defeated them, then you must destroy them totally. Make no treaty with them, and show them no mercy.",
//             ESV: "1 When the Lord your God brings you into the land that you are entering to possess, and clears away many nations before you—the Hittites, the Girgashites, the Amorites, the Canaanites, the Perizzites, the Hivites, and the Jebusites, seven nations more numerous and mightier than you—2 and when the Lord your God gives them over to you, and you defeat them, then you must devote them to complete destruction. You shall make no covenant with them and show them no mercy.",
//             AMP: "1 When the Lord your God brings you into the land you are about to enter to possess, and He drives out many nations before you—the Hittites, Girgashites, Amorites, Canaanites, Perizzites, Hivites, and Jebusites, seven nations more numerous and stronger than you—2 and when the Lord your God delivers them over to you and you defeat them, you shall utterly destroy them. You shall make no covenant with them and show them no mercy.",
//             NLT: "1 When the Lord your God brings you into the land you are about to enter and possess, and he drives out many nations before you—the Hittites, Girgashites, Amorites, Canaanites, Perizzites, Hivites, and Jebusites, seven nations larger and stronger than you—2 and when the Lord your God delivers them over to you, you must completely destroy them. Make no treaties with them and show them no mercy."
//         },
        


// };
const initialScriptureDB: ScriptureDB = {
    
    "2 Corinthians 6:14": {
        KJV: "14 Be ye not unequally yoked together with unbelievers: for what fellowship hath righteousness with unrighteousness? and what communion hath light with darkness?",
        NKJV: "14 Do not be unequally yoked together with unbelievers. For what fellowship has righteousness with lawlessness? And what communion has light with darkness?",
        NIV: "14 Do not be yoked together with unbelievers. For what do righteousness and wickedness have in common? Or what fellowship can light have with darkness?",
        ESV: "14 Do not be unequally yoked with unbelievers. For what partnership has righteousness with lawlessness? Or what fellowship has light with darkness?",
        AMP: "14 Do not be unequally yoked with unbelievers [do not make misaligned alliances with them or come under a different spirit, which is inconsistent with your faith]. For what partnership have righteousness and lawlessness [or how can right conduct and lawlessness be partners]? Or what fellowship has light with darkness?",
        NLT: "14 Don’t team up with those who are unbelievers. How can righteousness be a partner with wickedness? How can light live with darkness?"
    },
    "Ephesians 5:15": {
        KJV: "15 See then that ye walk circumspectly, not as fools, but as wise,",
        NKJV: "15 See then that you walk circumspectly, not as fools but as wise,",
        NIV: "15 Be very careful, then, how you live—not as unwise but as wise,",
        ESV: "15 Look carefully then how you walk, not as unwise but as wise,",
        AMP: "15 Therefore see that you walk carefully [living life with honor, purpose, and gratitude; not as men who are unwise, but as wise sensible minds],",
        NLT: "15 So be careful how you live. Don’t live like fools, but like those who are wise."
    },
    "Joshua 9:14": {
        KJV: "14 And the men took of their victuals, and asked not counsel at the mouth of the Lord.",
        NKJV: "14 Then the men of Israel took some of their provisions; but they did not ask counsel of the Lord.",
        NIV: "14 The Israelites sampled their provisions but did not inquire of the Lord.",
        ESV: "14 So the men took some of their provisions, but did not ask counsel from the Lord.",
        AMP: "14 So the men [of Israel] took some of their own provisions [and offered them in friendship], and did not ask for the counsel of the Lord.",
        NLT: "14 So the Israelites examined their food, but they did not consult the Lord."
    },
    "Joshua 9:14-19": {
        KJV: "14 And the men took of their victuals, and asked not counsel at the mouth of the Lord. 15 And Joshua made peace with them, and made a league with them, to let them live: and the princes of the congregation sware unto them. 16 And it came to pass at the end of three days after they had made a league with them, that they heard that they were their neighbours, and that they dwelt among them. 17 And the children of Israel journeyed, and came unto their cities on the third day. Now their cities were Gibeon, and Chephirah, and Beeroth, and Kirjathjearim. 18 And the children of Israel smote them not, because the princes of the congregation had sworn unto them by the Lord God of Israel. And all the congregation murmured against the princes. 19 But all the princes said unto all the congregation, We have sworn unto them by the Lord God of Israel: now therefore we may not touch them.",
        NKJV: "14 Then the men of Israel took some of their provisions; but they did not ask counsel of the Lord. 15 So Joshua made peace with them, and made a covenant with them to let them live; and the rulers of the congregation swore to them. 16 And it happened at the end of three days, after they had made a covenant with them, that they heard that they were their neighbors who dwelt near them. 17 Then the children of Israel journeyed and came to their cities on the third day. Now their cities were Gibeon, Chephirah, Beeroth, and Kirjath Jearim. 18 But the children of Israel did not attack them, because the rulers of the congregation had sworn to them by the Lord God of Israel. And all the congregation complained against the rulers. 19 Then all the rulers said to all the congregation, 'We have sworn to them by the Lord God of Israel; now therefore, we may not touch them.'",
        NIV: "14 The Israelites sampled their provisions but did not inquire of the Lord. 15 Then Joshua made a treaty of peace with them to let them live, and the leaders of the assembly ratified it by oath. 16 Three days after they made the treaty with the Gibeonites, the Israelites heard that they were neighbors, living near them. 17 So the Israelites set out and on the third day came to their cities: Gibeon, Kephirah, Beeroth and Kiriath Jearim. 18 But the Israelites did not attack them, because the leaders of the assembly had sworn an oath to them by the Lord, the God of Israel. The whole assembly grumbled against the leaders. 19 But all the leaders answered, 'We have given them our oath by the Lord, the God of Israel, and we cannot touch them now.'",
        ESV: "14 So the men took some of their provisions, but did not ask counsel from the Lord. 15 And Joshua made peace with them and made a covenant with them, to let them live, and the leaders of the congregation swore to them. 16 But at the end of three days after they had made a covenant with them, they heard that they were their neighbors and that they lived among them. 17 And the people of Israel set out and reached their cities on the third day. Now their cities were Gibeon, Chephirah, Beeroth, and Kiriath-jearim. 18 But the people of Israel did not attack them, because the leaders of the congregation had sworn to them by the Lord, the God of Israel. Then all the congregation murmured against the leaders. 19 But all the leaders said to all the congregation, 'We have sworn to them by the Lord, the God of Israel, and now we may not touch them.'",
        AMP: "14 So the men [of Israel] took some of their own provisions [and offered them in friendship], and did not ask for the counsel of the Lord. 15 Joshua made peace with them and made a covenant with them, to let them live, and the leaders of the congregation swore an oath to them. 16 It happened that after they had made a covenant with them, they heard that they were actually their neighbors and lived among them. 17 Then the sons of Israel set out and came to their cities on the third day. Now their cities were Gibeon, Chephirah, Beeroth, and Kiriath-jearim. 18 The sons of Israel did not kill them because the leaders of the congregation had sworn an oath to them by the Lord, the God of Israel. And all the congregation murmured against the leaders. 19 But all the leaders said to all the congregation, 'We have sworn an oath to them by the Lord, the God of Israel, and now we cannot touch them.'",
        NLT: "14 So the Israelites examined their food, but they did not consult the Lord. 15 Then Joshua made a peace treaty with them and guaranteed their safety, and the leaders of the community ratified their agreement with a binding oath. 16 Three days after making the treaty, they learned that these people actually lived nearby! 17 The Israelites set out at once to investigate and reached their towns in three days. The towns were Gibeon, Kephirah, Beeroth, and Kiriath-jearim. 18 But the Israelites did not attack the towns, for the Israelite leaders had made a vow to them in the name of the Lord, the God of Israel. The people of Israel grumbled against the leaders because of the treaty. 19 But the leaders replied, 'Since we have sworn an oath in the presence of the Lord, the God of Israel, we cannot touch them.'"
    },
    "2 Samuel 21:1-9": {
        KJV: "1 Then there was a famine in the days of David three years, year after year; and David enquired of the Lord. And the Lord answered, It is for Saul, and for his bloody house, because he slew the Gibeonites. 2 And the king called the Gibeonites, and said unto them; (now the Gibeonites were not of the children of Israel, but of the remnant of the Amorites; and the children of Israel had sworn unto them: and Saul sought to slay them in his zeal to the children of Israel and Judah.) 3 Wherefore David said unto the Gibeonites, What shall I do for you? and wherewith shall I make the atonement, that ye may bless the inheritance of the Lord? 4 And the Gibeonites said unto him, We will have no silver nor gold of Saul, nor of his house; neither for us shalt thou kill any man in Israel. And he said, What ye shall say, that will I do for you. 5 And they answered the king, The man that consumed us, and that devised against us that we should be destroyed from remaining in any of the coasts of Israel, 6 Let seven men of his sons be delivered unto us, and we will hang them up unto the Lord in Gibeah of Saul, whom the Lord did choose. And the king said, I will give them. 7 But the king spared Mephibosheth, the son of Jonathan the son of Saul, because of the Lord's oath that was between them, between David and Jonathan the son of Saul. 8 But the king took the two sons of Rizpah the daughter of Aiah, whom she bare unto Saul, Armoni and Mephibosheth; and the five sons of Michal the daughter of Saul, whom she brought up for Adriel the son of Barzillai the Meholathite: 9 And he delivered them into the hands of the Gibeonites, and they hanged them in the hill before the Lord: and they fell all seven together, and were put to death in the days of harvest, in the first days, in the beginning of barley harvest.",
        NKJV: "1 Now there was a famine in the days of David for three years, year after year; and David inquired of the Lord. And the Lord answered, 'It is because of Saul and his bloodthirsty house, because he killed the Gibeonites.' 2 So the king called the Gibeonites and spoke to them. (Now the Gibeonites were not of the children of Israel, but of the remnant of the Amorites; the children of Israel had sworn protection to them, but Saul had sought to kill them in his zeal for the children of Israel and Judah.) 3 Therefore David said to the Gibeonites, 'What shall I do for you? And with what shall I make atonement, that you may bless the inheritance of the Lord?' 4 And the Gibeonites said to him, 'We will have no silver or gold from Saul or from his house, nor shall you kill any man in Israel for us.' So he said, 'Whatever you say, I will do for you.' 5 Then they answered the king, 'As for the man who consumed us and plotted against us, that we should be destroyed from remaining in any of the territories of Israel, 6 let seven men of his descendants be delivered to us, and we will hang them before the Lord in Gibeah of Saul, whom the Lord chose.' And the king said, 'I will give them.' 7 But the king spared Mephibosheth the son of Jonathan, the son of Saul, because of the Lord’s oath that was between them, between David and Jonathan the son of Saul. 8 So the king took Armoni and Mephibosheth, the two sons of Rizpah the daughter of Aiah, whom she bore to Saul, and the five sons of Michal the daughter of Saul, whom she brought up for Adriel the son of Barzillai the Meholathite; 9 and he delivered them into the hands of the Gibeonites, and they hanged them on the hill before the Lord. So they fell, all seven together, and were put to death in the days of harvest, in the first days, in the beginning of barley harvest.",
        NIV: "1 During the reign of David, there was a famine for three successive years; so David sought the face of the Lord. The Lord said, 'It is on account of Saul and his blood-stained house; it is because he put the Gibeonites to death.' 2 The king summoned the Gibeonites and spoke to them. (Now the Gibeonites were not Israelites, but a remnant of the Amorites; the Israelites had sworn to spare them, but Saul in his zeal for Israel and Judah had tried to annihilate them.) 3 David asked the Gibeonites, 'What shall I do for you? How shall I make atonement so that you will bless the Lord’s inheritance?' 4 The Gibeonites answered him, 'We have no right to demand silver or gold from Saul or his family, nor do we have the right to put anyone in Israel to death.' 'What do you want me to do for you?' David asked. 5 They answered the king, 'As for the man who destroyed us and plotted against us so that we have been decimated and have no place anywhere in Israel, 6 let seven of his male descendants be given to us to be killed and exposed before the Lord at Gibeah of Saul—the Lord’s chosen one.' So the king said, 'I will give them.' 7 The king spared Mephibosheth son of Jonathan, the son of Saul, because of the oath before the Lord between David and Jonathan son of Saul. 8 But the king took Armoni and Mephibosheth, the two sons of Rizpah daughter of Aiah, whom she had borne to Saul, together with the five sons of Saul’s daughter Merab, whom she had borne to Adriel son of Barzillai the Meholathite. 9 He handed them over to the Gibeonites, who killed them and exposed them on a hill before the Lord. All seven of them fell together; they were put to death during the first days of the harvest, just as the barley harvest was beginning.",
        ESV: "1 Now there was a famine in the days of David for three years, year after year. And David sought the face of the Lord. And the Lord said, 'There is bloodguilt on Saul and on his house, because he put the Gibeonites to death.' 2 So the king called the Gibeonites and spoke to them. Now the Gibeonites were not of the people of Israel but of the remnant of the Amorites. Although the people of Israel had sworn to spare them, Saul had sought to strike them down in his zeal for the people of Israel and Judah. 3 And David said to the Gibeonites, 'What shall I do for you? And how shall I make atonement, that you may bless the heritage of the Lord?' 4 The Gibeonites said to him, 'It is not a matter of silver or gold between us and Saul or his house; neither is it for us to put any man to death in Israel.' And he said, 'What do you say that I shall do for you?' 5 They said to the king, 'The man who consumed us and planned to destroy us, so that we should have no place in all the territory of Israel, 6 let seven of his sons be given to us, so that we may hang them before the Lord at Gibeah of Saul, whom the Lord chose.' And the king said, 'I will give them.' 7 But the king spared Mephibosheth the son of Jonathan, Saul's son, because of the oath of the Lord that was between them, between David and Jonathan the son of Saul. 8 The king took the two sons of Rizpah the daughter of Aiah, whom she bore to Saul, Armoni and Mephibosheth; and the five sons of Merab the daughter of Saul, whom she bore to Adriel the son of Barzillai the Meholathite; 9 and he gave them into the hands of the Gibeonites, and they hanged them on the mountain before the Lord, and the seven of them perished together. They were put to death in the first days of harvest, at the beginning of barley harvest.",
        AMP: "1 Now there was a famine in the days of David for three years, year after year; and David sought the face of the Lord [and asked the reason for it]. The Lord answered, 'It is because of Saul and his bloody house, because he put the Gibeonites to death.' 2 So the king called the Gibeonites and spoke to them (now the Gibeonites were not of the sons of Israel but of the remnant of the Amorites, and the sons of Israel had sworn [an oath] to spare them, but Saul in his zeal for the sons of Israel and Judah had sought to strike them down). 3 So David said to the Gibeonites, 'What shall I do for you? And with what shall I make atonement so that you will bless the inheritance of the Lord?' 4 The Gibeonites said to him, 'It is not a matter of silver or gold between us and Saul or his house, nor is it for us to put any man to death in Israel.' David said, 'I will do for you whatever you say.' 5 So they said to the king, 'The man who consumed us and planned to destroy us, so that we should have no place in all the territory of Israel, 6 let seven men from his sons be given to us and we will hang them before the Lord in Gibeah of Saul, the chosen one of the Lord.' And the king said, 'I will give them.' 7 But the king spared Mephibosheth the son of Jonathan, the son of Saul, because of the Lord’s oath that was between them, between David and Jonathan the son of Saul. 8 So the king took the two sons of Rizpah the daughter of Aiah, whom she bore to Saul, Armoni and Mephibosheth, and the five sons of Merab the daughter of Saul, whom she bore to Adriel the son of Barzillai the Meholathite. 9 He handed them over to the Gibeonites, and they hanged them on the mountain before the Lord; the seven of them died together. They were put to death in the first days of harvest, at the beginning of the barley harvest.",
        NLT: "1 There was a famine during David’s reign that lasted for three years, so David asked the Lord about it. And the Lord said, 'The famine has come because Saul and his family are guilty of murdering the Gibeonites.' 2 So the king summoned the Gibeonites. They were not part of the Israelite nation but were survivors of the Amorites; the Israelites had promised to spare them, but Saul, in his zeal for Israel and Judah, had tried to destroy them. 3 David asked them, 'What can I do for you? How can I make amends so that you will again pronounce a blessing on the Lord’s inheritance?' 4 'Well, money can’t settle this matter between us and the family of Saul,' the Gibeonites replied. 'Neither can we demand the life of anyone in Israel.' 'What can I do then?' David asked. 'Just tell me and I will do it for you.' 5 Then they replied, 'It was Saul who planned to destroy us, to keep us from having any place at all in the territory of Israel. 6 So let seven of his sons be handed over to us, and we will execute them before the Lord at Gibeah, the hometown of Saul, the Lord’s chosen king.' 'All right,' the king said, 'I will do it.' 7 The king spared Jonathan’s son Mephibosheth, who was Saul’s grandson, because of the oath David and Jonathan had sworn before the Lord. 8 But he gave them Armoni and Mephibosheth, the two sons of Saul and Rizpah daughter of Aiah. He also gave them the five sons of Saul’s daughter Merab, the wife of Adriel son of Barzillai from Meholah. 9 The king gave them to the Gibeonites, who executed them on the mountain before the Lord. So all seven of them died together at the beginning of the barley harvest."
    },
    "Exodus 23:32-34": {
        KJV: "32 Thou shalt make no covenant with them, nor with their gods. 33 They shall not dwell in thy land, lest they make thee sin against me: for if thou serve their gods, it will surely be a snare unto thee.",
        NKJV: "32 You shall make no covenant with them, nor with their gods. 33 They shall not dwell in your land, lest they make you sin against Me. For if you serve their gods, it will surely be a snare to you.",
        NIV: "32 Do not make a covenant with them or with their gods. 33 Do not let them live in your land or they will cause you to sin against me, because the worship of their gods will certainly be a snare to you.",
        ESV: "32 You shall make no covenant with them and their gods. 33 They shall not dwell in your land, lest they make you sin against me; for if you serve their gods, it will surely be a snare to you.",
        AMP: "32 You shall make no covenant with them nor with their gods. 33 They shall not live in your land, because they will make you sin against Me; for if you serve their gods, it will surely be a snare to you [leading to eternal death].",
        NLT: "32 Make no treaty with them or their gods. 33 They must not live in your land, or they will cause you to sin against me. If you serve their gods, you will be caught in the trap of idolatry."
    },
    "Exodus 23:32": {
        KJV: "32 Thou shalt make no covenant with them, nor with their gods.",
        NKJV: "32 You shall make no covenant with them, nor with their gods.",
        NIV: "32 Do not make a covenant with them or with their gods.",
        ESV: "32 You shall make no covenant with them and their gods.",
        AMP: "32 You shall make no covenant with them nor with their gods.",
        NLT: "32 Make no treaty with them or their gods."
    },
    "Exodus 34:12-17": {
        KJV: "12 Take heed to thyself, lest thou make a covenant with the inhabitants of the land whither thou goest, lest it be for a snare in the midst of thee: 13 But ye shall destroy their altars, break their images, and cut down their groves: 14 For thou shalt worship no other god: for the Lord, whose name is Jealous, is a jealous God: 15 Lest thou make a covenant with the inhabitants of the land, and they go a whoring after their gods, and do sacrifice unto their gods, and one call thee, and thou eat of his sacrifice; 16 And thou take of their daughters unto thy sons, and their daughters go a whoring after their gods, and make thy sons go a whoring after their gods. 17 Thou shalt make thee no molten gods.",
        NKJV: "12 Take heed to yourself, lest you make a covenant with the inhabitants of the land where you are going, lest it be a snare in your midst. 13 But you shall destroy their altars, break their sacred pillars, and cut down their wooden images 14 (for you shall worship no other god, for the Lord, whose name is Jealous, is a jealous God), 15 lest you make a covenant with the inhabitants of the land, and they play the harlot with their gods and make sacrifice to their gods, and one of them invites you and you eat of his sacrifice, 16 and you take of their daughters for your sons, and their daughters play the harlot with their gods and make your sons play the harlot with their gods. 17 You shall make no molded gods for yourselves.",
        NIV: "12 Be careful not to make a treaty with those who live in the land where you are going, or they will be a snare among you. 13 Break down their altars, smash their sacred stones and cut down their Asherah poles. 14 Do not worship any other god, for the Lord, whose name is Jealous, is a jealous God. 15 Be careful not to make a treaty with those who live in the land; for when they prostitute themselves to their gods and sacrifice to them, they will invite you and you will eat their sacrifices. 16 And when you choose some of their daughters as wives for your sons and those daughters prostitute themselves to their gods, they will lead your sons to do the same. 17 Do not make any idols.",
        ESV: "12 Take care, lest you make a covenant with the inhabitants of the land to which you go, lest it become a snare in your midst. 13 You shall tear down their altars and break their pillars and cut down their Asherim 14 (for you shall worship no other god, for the Lord, whose name is Jealous, is a jealous God), 15 lest you make a covenant with the inhabitants of the land, and when they whore after their gods and sacrifice to their gods and you are invited, you eat of his sacrifice, 16 and you take of their daughters for your sons, and their daughters whore after their gods and make your sons whore after their gods. 17 You shall not make for yourself any gods of cast metal.",
        AMP: "12 Watch yourself, lest you make a covenant with the inhabitants of the land into which you are going, lest it become a snare in your midst. 13 But you shall tear down their altars, smash their [pagan] pillars, and cut down their Asherim (symbols of the goddess Asherah) 14 —for you shall not worship any other god; for the Lord, whose name is Jealous, is a jealous (impassioned) God [demanding what is His and its rightful due]— 15 lest you make a covenant with the inhabitants of the land and they play the prostitute with their gods and sacrifice to their gods, and someone invites you to eat his sacrifice, 16 and you take some of their daughters for your sons, and their daughters play the prostitute with their gods and make your sons play the prostitute with their gods. 17 You shall not make for yourselves any gods of cast metal.",
        NLT: "12 Be very careful never to make a treaty with the people who live in the land where you are going. If you do, you will follow their evil ways and be trapped. 13 Instead, you must break down their pagan altars, smash their sacred pillars, and cut down their Asherah poles. 14 You must worship no other gods, for the Lord, whose very name is Jealous, is a God who is jealous about his relationship with you. 15 Do not make a treaty of any kind with the people living in the land. They lust after their gods by offering sacrifices to them. They will invite you to join them in their sacrificial meals, and you will go with them. 16 Then you will accept their daughters, who sacrifice to other gods, as wives for your sons. And they will seduce your sons to commit adultery against me by worshiping other gods. 17 You must never make any gods of cast metal."
    },
    "Deuteronomy 7:2-3": {
        KJV: "2 And when the Lord thy God shall deliver them before thee; thou shalt smite them, and utterly destroy them; thou shalt make no covenant with them, nor shew mercy unto them: 3 Neither shalt thou make marriages with them; thy daughter thou shalt not give unto his son, nor his daughter shalt thou take unto thy son.",
        NKJV: "2 and when the Lord your God delivers them over to you, you shall conquer them and utterly destroy them. You shall make no covenant with them nor show mercy to them. 3 Nor shall you make marriages with them. You shall not give your daughter to their son, nor take their daughter for your son.",
        NIV: "2 and when the Lord your God has delivered them over to you and you have defeated them, then you must destroy them totally. Make no treaty with them, and show them no mercy. 3 Do not intermarry with them. Do not give your daughters to their sons or take their daughters for your sons,",
        ESV: "2 and when the Lord your God gives them over to you, and you defeat them, then you must devote them to complete destruction. You shall make no covenant with them and show no mercy to them. 3 You shall not intermarry with them, giving your daughters to their sons or taking their daughters for your sons,",
        AMP: "2 and when the Lord your God hands them over to you and you defeat them, then you must utterly destroy them. You shall not make a covenant with them nor show mercy to them. 3 You shall not intermarry with them; you shall not give your daughter to his son, nor shall you take his daughter for your son.",
        NLT: "2 When the Lord your God hands them over to you and you conquer them, you must completely destroy them. Make no treaty with them and show them no mercy. 3 You must not intermarry with them. Do not let your daughters marry their sons! And do not let your sons marry their daughters,"
    },
    
    "Joshua 10:6-7": {
        KJV: "6 And the men of Gibeon sent unto Joshua to the camp to Gilgal, saying, Slack not thy hand from thy servants; come up to us quickly, and save us, and help us: for all the kings of the Amorites that dwell in the mountains are gathered together against us. 7 So Joshua ascended from Gilgal, he, and all the people of war with him, and all the mighty men of valour.",
        NKJV: "6 And the men of Gibeon sent to Joshua at the camp at Gilgal, saying, 'Do not forsake your servants; come up to us quickly, save us and help us, for all the kings of the Amorites who dwell in the mountains have gathered together against us.' 7 So Joshua ascended from Gilgal, he and all the people of war with him, and all the mighty men of valor.",
        NIV: "6 The Gibeonites then sent word to Joshua in the camp at Gilgal: 'Do not abandon your servants. Come up to us quickly and save us! Help us, because all the Amorite kings from the hill country have joined forces against us.' 7 So Joshua marched up from Gilgal with his entire army, including all the best fighting men.",
        ESV: "6 And the men of Gibeon sent to Joshua at the camp in Gilgal, saying, 'Do not relax your hand from your servants. Come up to us quickly and save us and help us, for all the kings of the Amorites who dwell in the hill country are gathered against us.' 7 So Joshua went up from Gilgal, he and all the people of war with him, and all the mighty men of valor.",
        AMP: "6 So the men of Gibeon sent word to Joshua at the camp in Gilgal, saying, 'Do not abandon your servants; come up to us quickly and save us and help us, for all the [five] kings of the Amorites who live in the hill country have assembled against us.' 7 So Joshua went up from Gilgal, he and all the people of war with him and all the brave men of valor.",
        NLT: "6 The men of Gibeon quickly sent messengers to Joshua at his camp in Gilgal. 'Don’t abandon your servants now!' they pleaded. 'Come at once! Save us! Help us! For all the Amorite kings who live in the hill country have joined forces against us.' 7 So Joshua and his entire army, including his finest warriors, left Gilgal and set out for Gibeon."
    }
};

const quizQuestions = [
    {
        q: "If a covenant carries spiritual weight and is witnessed by God, how might this affect the way people approach agreements in life?",
        a: [
            "They would take covenants more seriously, knowing God oversees them",
            "They would ignore spiritual implications and focus only on personal gain",
            "They would only worry about legal consequences",
            "They would depend on luck rather than discernment"
        ],
        correct: 0
    },
    {
        q: "Considering the Gibeonites’ strategy, what can be inferred about human decision-making when appearances are trusted without verification?",
        a: [
            "Decisions can be misguided if one fails to investigate thoroughly",
            "Trusting appearances always leads to blessings",
            "All agreements are equally safe to accept",
            "God approves all human decisions regardless of caution"
        ],
        correct: 0
    },
    {
        q: "If someone enters a covenant without understanding it, what potential outcome does the lesson suggest might occur?",
        a: [
            "They may face unintended consequences that affect their life",
            "They will automatically prosper",
            "Nothing will change, since covenants are symbolic",
            "They gain advantage over others without effort"
        ],
        correct: 0
    },
    {
        q: "Why might it be important to examine covenants in one’s life, even if they were formed long ago?",
        a: [
            "Because past agreements can influence present circumstances and decisions",
            "Because old covenants are irrelevant",
            "Because only new agreements matter spiritually",
            "Because it is mainly a historical exercise"
        ],
        correct: 0
    },
    {
        q: "How might God’s role as a divine witness in covenants influence how parties behave?",
        a: [
            "It encourages faithfulness and accountability, knowing God oversees every action",
            "It allows parties to act selfishly without concern",
            "It has no effect on behavior",
            "It removes human responsibility entirely"
        ],
        correct: 0
    },
    {
        q: "If a covenant is broken or ignored, what lesson can be drawn regarding its impact on daily life?",
        a: [
            "Even unseen agreements can influence one’s destiny and circumstances",
            "Breaking covenants has no real-world effect",
            "Consequences only matter in legal contexts",
            "Only others are affected, not oneself"
        ],
        correct: 0
    },
    {
        q: "In the context of the lesson, what does the Gibeonites’ interaction with Israel reveal about human perception?",
        a: [
            "That people can be deceived by appearances or incomplete information",
            "That people always make correct judgments",
            "That divine guidance is unnecessary in decision-making",
            "That agreements are trivial in life"
        ],
        correct: 0
    },
    {
        q: "When reflecting on one’s spiritual life, how might prayer and discernment help with covenants?",
        a: [
            "It helps identify ungodly covenants and aligns actions with God’s will",
            "It replaces the need to examine covenants",
            "It only improves social relationships",
            "It has no effect on practical decision-making"
        ],
        correct: 0
    },
    {
        q: "How might understanding covenants affect the way someone approaches challenges or decisions in life?",
        a: [
            "It encourages careful evaluation, honoring God, and avoiding harmful agreements",
            "It leads to fear and inaction",
            "It promotes ignoring past mistakes",
            "It prioritizes worldly gain over spiritual wisdom"
        ],
        correct: 0
    }
];

const SundaySchoolApp = () => {
    const [showPaymentGate, setShowPaymentGate] = useState(true);
    const [isPaid, setIsPaid] = useState(false);
    const [activeTab, setActiveTab] = useState("intro");
    const [darkMode, setDarkMode] = useState(true);
    const [fontSize, setFontSize] = useState(16);
    const [loading, setLoading] = useState(false);
    const [appLoading, setAppLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [scriptureDB, setScriptureDB] =
        useState<ScriptureDB>(initialScriptureDB);
    const [selectedVerse, setSelectedVerse] = useState<string | null>(null);
    const [bibleVersion, setBibleVersion] =
        useState<keyof BibleVersions>("KJV");
    const [showVerseModal, setShowVerseModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [newVerse, setNewVerse] = useState<{
        reference: string;
        versions: BibleVersions;
    }>({
        reference: "",
        versions: { KJV: "", NKJV: "", NIV: "", ESV: "", AMP: "", NLT: "" },
    });
    const [verseLoading, setVerseLoading] = useState(false);
    const [quizActive, setQuizActive] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(50);
    const [showResults, setShowResults] = useState(false);
    const [faithRating, setFaithRating] = useState(5);
    const [commitments, setCommitments] = useState<
        Array<{ text: string; date: string }>
    >([]);
    const [commitmentInput, setCommitmentInput] = useState("");
    const [editingContent, setEditingContent] = useState<string | null>(null);

    type SubPoint = { title: string; content: string; scripture?: string };
    type LessonPoint = {
        title: string;
        content: string;
        scriptures: string[];
        subPoints: SubPoint[];
    };
    type ContentData = {
        lessonDate: string;
        lessonTitle: string;
        memoryVerse: string;
        memoryVerseRef: string;
        introduction: string;
        introScriptures: string[];
        lessonIntroScriptures: string[];
        aims: string;
        objectives: string;
        lessonIntro: string;
        lessonPoints: LessonPoint[];
        conclusion: string;
        conclusionScriptures: string[];
        prayerPoints: string[];
    };

    
    const [contentData, setContentData] = useState<ContentData>({
    lessonDate: "December 28, 2025",
    lessonTitle: "The Strength of Covenant – Part 3",

    memoryVerse:
        "Be ye not unequally yoked together with unbelievers: for what fellowship hath righteousness with unrighteousness? And what communion hath light with darkness?",
    memoryVerseRef: "2 Corinthians 6:14",

    introScriptures: ["Ephesians 5:15"], 
    lessonIntroScriptures: [],

    introduction:
        "Man is a very powerful being to reckon with of all the creatures of God but his attitude of hasty conclusion on matters has been his problem. Most times he acts before reasoning and gets undesired results. The enemy took advantage of this at EDEN on man and is yet using it today to outwit man. People are often more concerned with the benefits of Covenants without considering the conditions which they possibly may not be able to keep. In Eph 5:15 God strongly request us to be more cautious in order to avoid dangers.",

    aims:
        "To reveal the implications of covenants since man is surrounded or obliged to surround himself by it.",

    objectives: "To cause man to be mindful of holy covenants and discard evil covenant through Christ.",

    lessonIntro:
        "In our previous lesson we looked at the sides of a covenant but today we will consider a wide spectrum of lesson drawn from this subject.",

    lessonPoints: [
        {
            title: "The Need for Counsel – verse 14",
            content:
                "A Covenant is not anything that should be initiated without proper counsel. You need to know the advantages, disadvantages and demands to see if you will be able to meet up before entering into it. Israel like many of us failed because they didn’t seek God’s counsel. Please make a thorough investigation before commitment.",
            scriptures: ["Joshua 9:14"],
            subPoints: [],
        },
        {
            title: "Covenant With Unbelievers – verse 15",
            content:
                "God has commanded us not to covenant ourselves with unbelievers because it will always usher in ugly situations. see Exo 23:32, 34:12-17, Deut 7:2-3, 2 Cor 6:14.  Covenant transfer belongings including the partner’s mess and his gods in the case of unbelievers. That is why marriage to an unbeliever is dangerous. Israel was ensnared by their covenant to Gibeon.",
            scriptures: ["Exodus 23:32","Exodus 34:12-17", "Deuteronomy 7:2-3", "2 Corinthians 6:14"],
            subPoints: [],
        },
        {
            title: "Time Walls",
            content:
                "Only time separated the Jews from the truth about their deceptive visitors. If they had been a little more cautious and patient and allow time to elapse, they would have escaped the trap. Deceivers have no time to waste and are always in a hurry. Impatient folks are therefore always the victims of their abattoir for slaughter.",
            scriptures: [],
            subPoints: [],
        },
    ],

    conclusion:
        "Let us spare God the stress by escaping the dangers we could avoid.",

    conclusionScriptures: [],

    prayerPoints: [
        "Heavenly Father, teach me to seek Your counsel before entering into any covenant.",
        "Lord, help me avoid covenants with unbelievers and remain in Your protection.",
        "Father, give me patience and discernment to see through deception and not act hastily.",
        "Lord Jesus, guide me in keeping holy covenants and avoiding evil ones.",
        "Holy Spirit, empower me to walk in integrity and wisdom in all covenantal matters.",
    ],
});


    const formatScriptureText = (text: string) => {
        const parts = text.split(/(\d+)/);
        return parts.map((part, index) => {
            if (/^\d+$/.test(part)) {
                return (
                    <strong key={index} className="font-bold">
                        {part}
                    </strong>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setAppLoading(false), 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
        return () => clearInterval(interval);
    }, []);

    const toggleTheme = () => setDarkMode(!darkMode);
    const adjustFontSize = (delta: number) =>
        setFontSize((prev) => Math.min(Math.max(prev + delta, 12), 24));
    const handleTabChange = (tab: string) => {
        setLoading(true);
        setTimeout(() => {
            setActiveTab(tab);
            setLoading(false);
        }, 500);
    };

    const showBibleVersions = (reference: string) => {
        setSelectedVerse(reference);
        setShowVerseModal(true);
        setVerseLoading(true);
        setTimeout(() => setVerseLoading(false), 800);
    };

    const changeBibleVersion = (version: keyof BibleVersions) => {
        setVerseLoading(true);
        setTimeout(() => {
            setBibleVersion(version);
            setVerseLoading(false);
        }, 600);
    };

    const addNewScripture = () => {
        if (
            newVerse.reference &&
            Object.values(newVerse.versions).some((v) => v !== "")
        ) {
            setScriptureDB((prev) => ({
                ...prev,
                [newVerse.reference]: newVerse.versions,
            }));
            setNewVerse({
                reference: "",
                versions: {
                    KJV: "",
                    NKJV: "",
                    NIV: "",
                    ESV: "",
                    AMP: "",
                    NLT: "",
                },
            });
            setEditMode(false);
        }
    };

    const updateVerseVersion = (version: keyof BibleVersions, text: string) => {
        setNewVerse((prev) => ({
            ...prev,
            versions: { ...prev.versions, [version]: text },
        }));
    };

    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | undefined;
        if (quizActive && timeLeft > 0 && !showResults) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        endQuiz();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [quizActive, timeLeft, showResults]);

    const startQuiz = () => {
        setQuizActive(true);
        setCurrentQuestion(0);
        setScore(0);
        setTimeLeft(50);
        setShowResults(false);
    };

    const checkAnswer = (choice: number) => {
        if (!quizActive || showResults) return;
        const correct = quizQuestions[currentQuestion].correct === choice;
        const timeBonus = Math.floor(timeLeft / 10);
        const points = correct ? 10 + timeBonus : 0;
        if (correct) setScore((prev) => prev + points);
        if (currentQuestion < quizQuestions.length - 1) {
            setTimeout(() => setCurrentQuestion((prev) => prev + 1), 1000);
        } else {
            setTimeout(() => endQuiz(), 1000);
        }
    };

    const endQuiz = () => {
        setQuizActive(false);
        setShowResults(true);
    };

    const addCommitment = () => {
        if (commitmentInput.trim()) {
            setCommitments((prev) => [
                ...prev,
                {
                    text: commitmentInput,
                    date: new Date().toLocaleDateString(),
                },
            ]);
            setCommitmentInput("");
        }
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === "M") {
                e.preventDefault();
                handleTabChange("manage");
            }
            if (e.ctrlKey && e.shiftKey && e.key === "E") {
                e.preventDefault();
                setEditingContent(editingContent ? null : activeTab);
            }
        };
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [editingContent, activeTab]);

    const updateContent = (field: string, value: string) =>
        setContentData((prev) => ({ ...prev, [field]: value }));
    const updateLessonPoint = (index: number, field: string, value: string) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === index ? { ...point, [field]: value } : point
            ),
        }));
    };
    const updatePrayerPoint = (index: number, value: string) => {
        setContentData((prev) => ({
            ...prev,
            prayerPoints: prev.prayerPoints.map((prayer, i) =>
                i === index ? value : prayer
            ),
        }));
    };
    const updateLessonSubPoint = (
        pointIndex: number,
        subIndex: number,
        field: string,
        value: string
    ) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === pointIndex
                    ? {
                          ...point,
                          subPoints: point.subPoints.map((sub, j) =>
                              j === subIndex ? { ...sub, [field]: value } : sub
                          ),
                      }
                    : point
            ),
        }));
    };
    const addLessonSubPoint = (pointIndex: number) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === pointIndex
                    ? {
                          ...point,
                          subPoints: [
                              ...point.subPoints,
                              {
                                  title: "New Point",
                                  content: "",
                                  scripture: "",
                              },
                          ],
                      }
                    : point
            ),
        }));
    };
    const deleteLessonSubPoint = (pointIndex: number, subIndex: number) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === pointIndex
                    ? {
                          ...point,
                          subPoints: point.subPoints.filter(
                              (_, j) => j !== subIndex
                          ),
                      }
                    : point
            ),
        }));
    };
    const addPrayerPoint = () =>
        setContentData((prev) => ({
            ...prev,
            prayerPoints: [...prev.prayerPoints, "New prayer point..."],
        }));

    const PAYSTACK_PUBLIC_KEY =
        "pk_test_bed97038ebcf74b30219ed0500cfffc6e80948f1";
    const PAYMENT_AMOUNT = 500000;

    const handlePaystackSuccess = (reference: unknown) => {
        console.log("Payment successful:", reference);
        setIsPaid(true);
        setShowPaymentGate(false);
    };

    const handlePaystackClose = () => console.log("Payment closed");

    const initializePaystack = () => {
        if (!window.PaystackPop) {
            alert("Paystack script not loaded!");
            return;
        }
        const paystack = window.PaystackPop.setup({
            key: PAYSTACK_PUBLIC_KEY,
            email: "user@example.com",
            amount: PAYMENT_AMOUNT,
            currency: "NGN",
            reference: "SSA_" + Math.floor(Math.random() * 1000000000 + 1),
            onClose: () => handlePaystackClose(),
            callback: (transaction: PaystackResponse) =>
                handlePaystackSuccess(transaction),
        });
        paystack.openIframe();
    };

    const handleFreePlan = () => {
        setShowPaymentGate(false);
        setIsPaid(false);
    };

    const themeClasses = darkMode
        ? "bg-gradient-to-br from-gray-900 via-blue-900 to-green-900 text-white"
        : "bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 text-gray-900";

    if (appLoading) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center z-50">
                <div className="text-center">
                    <div className="relative mb-8">
                        <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                            <img
                                src={logo}
                                alt="Logo"
                                className="w-20 h-20 object-contain"
                            />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 rounded-full border-4 border-white/30 animate-ping"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div
                                className="w-40 h-40 rounded-full border-4 border-white/20 animate-ping"
                                style={{ animationDelay: "0.3s" }}
                            ></div>
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Life Gate Ministries Worldwide
                    </h1>
                    <p className="text-xl text-white/90 mb-8">
                        Sunday School Lessons
                    </p>
                    <div className="text-white/80 mb-6 text-lg animate-pulse">
                        Loading Sunday School Lesson...
                    </div>
                    <div className="w-64 mx-auto bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                        <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300 ease-out shadow-lg"
                            style={{ width: `${loadingProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-white/70 mt-3 text-sm">
                        {loadingProgress}%
                    </p>
                </div>
            </div>
        );
    }

    if (showPaymentGate) {
        return (
            <div
                className={`min-h-screen ${themeClasses} flex items-center justify-center p-4 relative overflow-hidden`}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-96 h-96 bg-purple-500/30 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
                    <div
                        className="absolute w-96 h-96 bg-blue-500/30 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"
                        style={{ animationDelay: "1s" }}
                    ></div>
                    <div
                        className="absolute w-64 h-64 bg-pink-500/20 rounded-full blur-3xl top-1/2 left-1/2 animate-pulse"
                        style={{ animationDelay: "2s" }}
                    ></div>
                </div>
                <div className="max-w-4xl w-full relative z-10">
                    <div className="text-center mb-12">
                        <div className="w-24 h-24 mx-auto mb-6 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl border border-white/20">
                            <img
                                src={logo}
                                alt="Logo"
                                className="w-16 h-16 object-contain"
                            />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Sunday School Lesson
                        </h1>
                        <p className="text-xl opacity-80">
                            The Strength of Covenant - Part 3
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition duration-300 shadow-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold">
                                        Free Access
                                    </h3>
                                    <Unlock
                                        className="text-green-400"
                                        size={32}
                                    />
                                </div>
                                <div className="mb-6">
                                    <p className="text-4xl font-bold mb-2">
                                        ₦0
                                    </p>
                                    <p className="opacity-70">View Only Mode</p>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-green-400"
                                        />
                                        <span>Read all lesson content</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-green-400"
                                        />
                                        <span>Take interactive quizzes</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <X size={20} className="text-red-400" />
                                        <span className="opacity-50">
                                            No content editing
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <X size={20} className="text-red-400" />
                                        <span className="opacity-50">
                                            No scripture management
                                        </span>
                                    </li>
                                </ul>
                                <button
                                    onClick={handleFreePlan}
                                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-semibold text-white shadow-lg transform hover:scale-105 transition duration-300"
                                >
                                    Continue Free
                                </button>
                            </div>
                        </div>
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition duration-300 shadow-2xl">
                                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                    BEST VALUE
                                </div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold">
                                        Premium Access
                                    </h3>
                                    <Lock
                                        className="text-purple-400"
                                        size={32}
                                    />
                                </div>
                                <div className="mb-6">
                                    <p className="text-4xl font-bold mb-2">
                                        ₦5,000
                                    </p>
                                    <p className="opacity-70">Full Access</p>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Everything in Free</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Edit all lesson content</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Manage Bible scriptures</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Save your commitments</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Priority support</span>
                                    </li>
                                </ul>
                                <button
                                    onClick={initializePaystack}
                                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-xl font-semibold text-white shadow-lg transform hover:scale-105 transition duration-300"
                                >
                                    Unlock Premium
                                </button>
                            </div>
                        </div>
                    </div>
                    <p className="text-center mt-8 opacity-70 text-sm">
                        Secure payment powered by Paystack • All transactions
                        are encrypted
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen ${themeClasses} transition-all duration-500 relative`}
            style={{ fontSize: `${fontSize}px` }}
        >
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl top-0 left-1/4 animate-pulse"></div>
                <div
                    className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl bottom-0 right-1/4 animate-pulse"
                    style={{ animationDelay: "1s" }}
                ></div>
            </div>
            <Header
                logo={logo}
                contentData={contentData}
                fontSize={fontSize}
                adjustFontSize={adjustFontSize}
                darkMode={darkMode}
                toggleTheme={toggleTheme}
            />
            <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {contentData.lessonTitle}
                </h2>
                <div className="flex gap-2 mb-6 overflow-x-auto flex-nowrap md:flex-wrap justify-start md:justify-center scrollbar-hide backdrop-blur-sm bg-white/5 p-2 rounded-2xl border border-white/10">
                    {[
                        "intro",
                        "lesson",
                        "conclusion",
                        "application",
                        "quiz",
                        "prayer",
                    ].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all flex-shrink-0 ${
                                activeTab === tab
                                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105"
                                    : darkMode
                                    ? "bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/10"
                                    : "bg-black/10 backdrop-blur-md hover:bg-black/20 border border-black/10"
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                    {isPaid && (
                        <button
                            onClick={() => handleTabChange("manage")}
                            className={`px-2 py-3 rounded-xl font-semibold transition-all flex-shrink-0 opacity-0 hover:opacity-10 ${
                                activeTab === "manage"
                                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105"
                                    : "bg-white/10 backdrop-blur-md"
                            }`}
                            title="Admin"
                            style={{ width: "40px" }}
                        >
                            <Edit2 size={16} className="mx-auto" />
                        </button>
                    )}
                </div>
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                    </div>
                )}
                {!loading && (
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8">
                        {activeTab === "intro" && (
                            <div className="space-y-6">
                                {editingContent === "intro" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <div
                                    className={`${
                                        darkMode
                                            ? "bg-blue-900/30"
                                            : "bg-blue-50"
                                    } p-6 rounded-lg border-l-4 border-blue-600`}
                                >
                                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                        <BookOpen className="text-blue-600" />{" "}
                                        Memory Verse
                                    </h3>
                                    {editingContent === "intro" ? (
                                        <textarea
                                            value={contentData.memoryVerse}
                                            onChange={(e) =>
                                                updateContent(
                                                    "memoryVerse",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full px-4 py-2 rounded-lg border text-xl italic mb-4 ${
                                                darkMode
                                                    ? "bg-gray-800 border-gray-600"
                                                    : "bg-white border-gray-300"
                                            }`}
                                            rows={2}
                                        />
                                    ) : (
                                        <blockquote className="text-xl italic mb-4">
                                            "{contentData.memoryVerse}"
                                        </blockquote>
                                    )}
                                    <button
                                        onClick={() =>
                                            showBibleVersions(
                                                contentData.memoryVerseRef
                                            )
                                        }
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                    >
                                        <BookOpen size={16} />
                                        Read {contentData.memoryVerseRef}
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-3">
                                        Text: Joshua 9:14-19, 2 Samuel 21:1-9
                                    </h3>
                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            onClick={() =>
                                                showBibleVersions(
                                                    "Joshua 9:14-19"
                                                )
                                            }
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                        >
                                            <BookOpen size={16} />
                                            Read Joshua 9:14-19
                                        </button>
                                        <button
                                            onClick={() =>
                                                showBibleVersions(
                                                    "2 Samuel 21:1-9"
                                                )
                                            }
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                        >
                                            <BookOpen size={16} />
                                            Read 2 Samuel 21:1-9
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-3">
                                        Introduction
                                    </h3>
                                    {editingContent === "intro" ? (
                                        <textarea
                                            value={contentData.introduction}
                                            onChange={(e) =>
                                                updateContent(
                                                    "introduction",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full px-4 py-2 rounded-lg border ${
                                                darkMode
                                                    ? "bg-gray-800 border-gray-600"
                                                    : "bg-white border-gray-300"
                                            }`}
                                            rows={6}
                                        />
                                    ) : (
                                        <p className="leading-relaxed">
                                            {contentData.introduction}
                                        </p>
                                    )}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {contentData.introScriptures.map(
                                            (scripture) => (
                                                <button
                                                    key={scripture}
                                                    onClick={() =>
                                                        showBibleVersions(
                                                            scripture
                                                        )
                                                    }
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
                                                >
                                                    <BookOpen size={14} />
                                                    {scripture}
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                                <div
                                    className={`${
                                        darkMode
                                            ? "bg-green-900/30"
                                            : "bg-green-50"
                                    } p-6 rounded-lg`}
                                >
                                    <h3 className="text-xl font-bold mb-3">
                                        Aims and Objectives
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <strong className="text-green-700 dark:text-green-400">
                                                AIMS:
                                            </strong>
                                            {editingContent === "intro" ? (
                                                <textarea
                                                    value={contentData.aims}
                                                    onChange={(e) =>
                                                        updateContent(
                                                            "aims",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full px-3 py-2 rounded-lg border mt-2 ${
                                                        darkMode
                                                            ? "bg-gray-800 border-gray-600"
                                                            : "bg-white border-gray-300"
                                                    }`}
                                                    rows={3}
                                                />
                                            ) : (
                                                <p>{contentData.aims}</p>
                                            )}
                                        </div>
                                        <div>
                                            <strong className="text-green-700 dark:text-green-400">
                                                OBJECTIVES:
                                            </strong>
                                            {editingContent === "intro" ? (
                                                <textarea
                                                    value={
                                                        contentData.objectives
                                                    }
                                                    onChange={(e) =>
                                                        updateContent(
                                                            "objectives",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full px-3 py-2 rounded-lg border mt-2 ${
                                                        darkMode
                                                            ? "bg-gray-800 border-gray-600"
                                                            : "bg-white border-gray-300"
                                                    }`}
                                                    rows={2}
                                                />
                                            ) : (
                                                <p>{contentData.objectives}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "lesson" && (
                            <div className="space-y-6">
                                {editingContent === "lesson" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-4">
                                    Lesson Content
                                </h3>
                                {editingContent === "lesson" ? (
                                    <textarea
                                        value={contentData.lessonIntro}
                                        onChange={(e) =>
                                            updateContent(
                                                "lessonIntro",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full px-4 py-2 rounded-lg border mb-4 ${
                                            darkMode
                                                ? "bg-gray-800 border-gray-600"
                                                : "bg-white border-gray-300"
                                        }`}
                                        rows={3}
                                    />
                                ) : (
                                    <p className="leading-relaxed mb-4">
                                        {contentData.lessonIntro}
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {contentData.lessonIntroScriptures.map(
                                                (scripture) => (
                                                    <button
                                                        key={scripture}
                                                        onClick={() =>
                                                            showBibleVersions(
                                                                scripture
                                                            )
                                                        }
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
                                                    >
                                                        <BookOpen size={14} />
                                                        {scripture}
                                                    </button>
                                                )
                                            )}
                                    
                                        </div>
                                        
                                    </p>
                                    
                                )}
                                <div className="space-y-6">
                                    {contentData.lessonPoints.map(
                                        (section, idx) => (
                                            <div
                                                key={idx}
                                                className={`${
                                                    darkMode
                                                        ? "bg-gray-700"
                                                        : "bg-gray-50"
                                                } p-5 rounded-lg`}
                                            >
                                                {editingContent === "lesson" ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            value={
                                                                section.title
                                                            }
                                                            onChange={(e) =>
                                                                updateLessonPoint(
                                                                    idx,
                                                                    "title",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={`w-full px-3 py-2 rounded-lg border mb-3 text-xl font-semibold ${
                                                                darkMode
                                                                    ? "bg-gray-800 border-gray-600"
                                                                    : "bg-white border-gray-300"
                                                            }`}
                                                        />
                                                        {section.content && (
                                                            <textarea
                                                                value={
                                                                    section.content
                                                                }
                                                                onChange={(e) =>
                                                                    updateLessonPoint(
                                                                        idx,
                                                                        "content",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className={`w-full px-3 py-2 rounded-lg border mb-3 ${
                                                                    darkMode
                                                                        ? "bg-gray-800 border-gray-600"
                                                                        : "bg-white border-gray-300"
                                                                }`}
                                                                rows={3}
                                                            />
                                                        )}
                                                        <div className="ml-6 space-y-3 mt-3">
                                                            {section.subPoints.map(
                                                                (
                                                                    subPoint,
                                                                    subIdx
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            subIdx
                                                                        }
                                                                        className={`${
                                                                            darkMode
                                                                                ? "bg-gray-800"
                                                                                : "bg-white"
                                                                        } p-3 rounded-lg`}
                                                                    >
                                                                        <div className="flex justify-between items-start mb-2">
                                                                            <span className="text-sm font-bold text-yellow-600">
                                                                                {String.fromCharCode(
                                                                                    97 +
                                                                                        subIdx
                                                                                )}

                                                                                .
                                                                            </span>
                                                                            <button
                                                                                onClick={() =>
                                                                                    deleteLessonSubPoint(
                                                                                        idx,
                                                                                        subIdx
                                                                                    )
                                                                                }
                                                                                className="text-red-600 hover:text-red-800"
                                                                            >
                                                                                <X
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                subPoint.title
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLessonSubPoint(
                                                                                    idx,
                                                                                    subIdx,
                                                                                    "title",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Sub-point title"
                                                                            className={`w-full px-3 py-1 rounded border mb-2 text-sm font-semibold ${
                                                                                darkMode
                                                                                    ? "bg-gray-700 border-gray-600"
                                                                                    : "bg-gray-50 border-gray-300"
                                                                            }`}
                                                                        />
                                                                        <textarea
                                                                            value={
                                                                                subPoint.content
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLessonSubPoint(
                                                                                    idx,
                                                                                    subIdx,
                                                                                    "content",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Sub-point content"
                                                                            className={`w-full px-3 py-1 rounded border mb-2 text-sm ${
                                                                                darkMode
                                                                                    ? "bg-gray-700 border-gray-600"
                                                                                    : "bg-gray-50 border-gray-300"
                                                                            }`}
                                                                            rows={
                                                                                2
                                                                            }
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                subPoint.scripture ||
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLessonSubPoint(
                                                                                    idx,
                                                                                    subIdx,
                                                                                    "scripture",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Scripture reference (optional)"
                                                                            className={`w-full px-3 py-1 rounded border text-sm ${
                                                                                darkMode
                                                                                    ? "bg-gray-700 border-gray-600"
                                                                                    : "bg-gray-50 border-gray-300"
                                                                            }`}
                                                                        />
                                                                    </div>
                                                                )
                                                            )}
                                                            <button
                                                                onClick={() =>
                                                                    addLessonSubPoint(
                                                                        idx
                                                                    )
                                                                }
                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                                                            >
                                                                <Plus
                                                                    size={14}
                                                                />{" "}
                                                                Add Sub-point
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <h4 className="text-xl font-semibold mb-2">
                                                            {idx + 1}.{" "}
                                                            {section.title}
                                                        </h4>
                                                        {section.content && (
                                                            <p className="leading-relaxed mb-3">
                                                                {
                                                                    section.content
                                                                }
                                                            </p>
                                                        )}
                                                        {section.scriptures &&
                                                            section.scriptures
                                                                .length > 0 && (
                                                                <div className="mt-3 flex flex-wrap gap-2">
                                                                    {section.scriptures.map(
                                                                        (
                                                                            scripture
                                                                        ) => (
                                                                            <button
                                                                                key={
                                                                                    scripture
                                                                                }
                                                                                onClick={() =>
                                                                                    showBibleVersions(
                                                                                        scripture
                                                                                    )
                                                                                }
                                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition flex items-center gap-2 text-sm"
                                                                            >
                                                                                <BookOpen
                                                                                    size={
                                                                                        14
                                                                                    }
                                                                                />
                                                                                {
                                                                                    scripture
                                                                                }
                                                                            </button>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                        {section.subPoints &&
                                                            section.subPoints
                                                                .length > 0 && (
                                                                <ol className="list-[lower-alpha] ml-6 space-y-3 mt-3">
                                                                    {section.subPoints.map(
                                                                        (
                                                                            subPoint,
                                                                            subIdx
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    subIdx
                                                                                }
                                                                            >
                                                                                <strong>
                                                                                    {
                                                                                        subPoint.title
                                                                                    }

                                                                                    :
                                                                                </strong>{" "}
                                                                                {
                                                                                    subPoint.content
                                                                                }
                                                                                {subPoint.scripture && (
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            if (
                                                                                                subPoint.scripture
                                                                                            )
                                                                                                showBibleVersions(
                                                                                                    subPoint.scripture
                                                                                                );
                                                                                        }}
                                                                                        className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                                                                                    >
                                                                                        📖
                                                                                        Read{" "}
                                                                                        {
                                                                                            subPoint.scripture
                                                                                        }
                                                                                    </button>
                                                                                )}
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ol>
                                                            )}
                                                    </>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === "conclusion" && (
                            <div className="space-y-4">
                                {editingContent === "conclusion" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-4">
                                    Conclusion
                                </h3>
                                {editingContent === "conclusion" ? (
                                    <textarea
                                        value={contentData.conclusion}
                                        onChange={(e) =>
                                            updateContent(
                                                "conclusion",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full px-4 py-2 rounded-lg border text-lg ${
                                            darkMode
                                                ? "bg-gray-800 border-gray-600"
                                                : "bg-white border-gray-300"
                                        }`}
                                        rows={4}
                                    />
                                ) : (
                                    <p className="text-lg leading-relaxed">
                                        {contentData.conclusion}
                                    </p>
                                )}
                                {contentData.conclusionScriptures &&
                                    contentData.conclusionScriptures.length >
                                        0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {contentData.conclusionScriptures.map(
                                                (scripture) => (
                                                    <button
                                                        key={scripture}
                                                        onClick={() =>
                                                            showBibleVersions(
                                                                scripture
                                                            )
                                                        }
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
                                                    >
                                                        <BookOpen size={14} />
                                                        {scripture}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>
                        )}
                




    {activeTab === "application" && (
    <div className="space-y-6">
        <h3 className="text-2xl font-bold mb-4">
            Personal Application
        </h3>
        <div
            className={`${
                darkMode
                    ? "bg-gray-700"
                    : "bg-gradient-to-r from-blue-50 to-indigo-50"
            } p-6 rounded-lg`}
        >
            <h4 className="text-xl font-semibold mb-4">
                Your Awareness and Response to Covenants
            </h4>
            <p className="mb-4">
                On a scale of 1 to 10, indicate how aware you are of covenants in your life and how consistently you honor or respond to them — spiritually, relationally, and personally.
            </p>
            <div className="flex items-center gap-4">
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={faithRating}
                    onChange={(e) =>
                        setFaithRating(Number(e.target.value))
                    }
                    className="flex-1"
                />
                <span className="text-2xl font-bold text-blue-600">
                    {faithRating}/10
                </span>
            </div>
            <p className="mt-3 text-sm italic">
                {faithRating >= 8
                    ? "Excellent! You are mindful of covenants and honoring God through your actions."
                    : faithRating >= 5
                    ? "Good! Reflect on areas where you can better discern and honor covenants."
                    : "Consider learning more about covenants and how to align your actions with God’s principles."}
            </p>
        </div>
        <div
            className={`${
                darkMode
                    ? "bg-gray-700"
                    : "bg-white border border-gray-200"
            } p-6 rounded-lg`}
        >
            <h4 className="text-xl font-semibold mb-4">
                Personal Covenant Commitments
            </h4>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                    type="text"
                    value={commitmentInput}
                    onChange={(e) =>
                        setCommitmentInput(e.target.value)
                    }
                    placeholder="Enter a personal commitment to honor, activate, or reject covenants according to God’s Word..."
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                        darkMode
                            ? "bg-gray-800 border-gray-600"
                            : "bg-white border-gray-300"
                    }`}
                    onKeyPress={(e) =>
                        e.key === "Enter" && addCommitment()
                    }
                />
                <button
                    onClick={addCommitment}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                    <Save size={16} /> Save
                </button>
            </div>
            <div className="space-y-2">
                {commitments.map((commitment, idx) => (
                    <div
                        key={idx}
                        className={`${
                            darkMode
                                ? "bg-gray-800"
                                : "bg-gray-50"
                        } p-3 rounded-lg flex items-start gap-3`}
                    >
                        <CheckCircle
                            className="text-green-600 mt-1"
                            size={20}
                        />
                        <div className="flex-1">
                            <p>{commitment.text}</p>
                            <p className="text-xs opacity-70 mt-1">
                                {commitment.date}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <p className="mt-4 text-sm italic text-gray-500">
                Use this section to reflect on covenants in your life — whether holy or ungodly — and write down practical steps to honor, reactivate, or break them through Christ. Consider how understanding covenants can impact your relationships, decisions, and spiritual growth.
            </p>
        </div>
    </div>
)}








                        {activeTab === "quiz" && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold">
                                        Speed Quiz Challenge
                                    </h3>
                                    {quizActive && (
                                        <div className="flex gap-4 items-center">
                                            <div className="flex items-center gap-2">
                                                <Clock className="text-blue-600" />
                                                <span className="text-xl font-bold">
                                                    {timeLeft}s
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Award className="text-yellow-600" />
                                                <span className="text-xl font-bold">
                                                    {score}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {!quizActive && !showResults && (
                                    <div className="text-center py-12">
                                        <Award
                                            size={64}
                                            className="mx-auto mb-4 text-yellow-600"
                                        />
                                        <h4 className="text-2xl font-bold mb-4">
                                            Ready to Test Your Knowledge?
                                        </h4>
                                        <p className="mb-6 text-lg">
                                            Answer quickly for bonus points!
                                        </p>
                                        <button
                                            onClick={startQuiz}
                                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-xl font-semibold transition transform hover:scale-105"
                                        >
                                            Start Quiz
                                        </button>
                                    </div>
                                )}
                                {quizActive && !showResults && (
                                    <div>
                                        <div
                                            className={`${
                                                darkMode
                                                    ? "bg-gray-700"
                                                    : "bg-blue-50"
                                            } p-6 rounded-lg mb-6`}
                                        >
                                            <h4 className="text-xl font-semibold mb-4">
                                                Question {currentQuestion + 1}{" "}
                                                of {quizQuestions.length}
                                            </h4>
                                            <p className="text-lg mb-6">
                                                {
                                                    quizQuestions[
                                                        currentQuestion
                                                    ].q
                                                }
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {quizQuestions[
                                                    currentQuestion
                                                ].a.map((answer, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() =>
                                                            checkAnswer(idx)
                                                        }
                                                        className={`${
                                                            darkMode
                                                                ? "bg-gray-800 hover:bg-gray-900"
                                                                : "bg-white hover:bg-gray-50"
                                                        } p-4 rounded-lg border-2 border-blue-600 transition transform hover:scale-105 text-left`}
                                                    >
                                                        <span className="font-bold text-blue-600 mr-2">
                                                            {String.fromCharCode(
                                                                65 + idx
                                                            )}
                                                            .
                                                        </span>
                                                        {answer}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {showResults && (
                                    <div className="text-center space-y-6">
                                        <Award
                                            size={80}
                                            className="mx-auto text-yellow-600"
                                        />
                                        <h4 className="text-3xl font-bold">
                                            Quiz Complete!
                                        </h4>
                                        <div
                                            className={`${
                                                darkMode
                                                    ? "bg-gray-700"
                                                    : "bg-gradient-to-r from-blue-50 to-indigo-50"
                                            } p-8 rounded-lg`}
                                        >
                                            <p className="text-5xl font-bold text-blue-600 mb-2">
                                                {score}
                                            </p>
                                            <p className="text-xl">
                                                Final Score
                                            </p>
                                            <p className="mt-4 text-lg">
                                                {score >= 100
                                                    ? "Outstanding! Excellent knowledge!"
                                                    : score >= 60
                                                    ? "Great work! Keep studying!"
                                                    : "Good effort! Review the lesson."}
                                            </p>
                                        </div>
                                        <button
                                            onClick={startQuiz}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === "prayer" && (
                            <div className="space-y-4">
                                {editingContent === "prayer" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-6">
                                    Prayer Points
                                </h3>
                                {contentData.prayerPoints.map((prayer, idx) => (
                                    <div
                                        key={idx}
                                        className={`${
                                            darkMode
                                                ? "bg-gray-700"
                                                : "bg-gradient-to-r from-purple-50 to-pink-50"
                                        } p-6 rounded-lg border-l-4 border-purple-600`}
                                    >
                                        {editingContent === "prayer" ? (
                                            <textarea
                                                value={prayer}
                                                onChange={(e) =>
                                                    updatePrayerPoint(
                                                        idx,
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full px-3 py-2 rounded-lg border ${
                                                    darkMode
                                                        ? "bg-gray-800 border-gray-600"
                                                        : "bg-white border-gray-300"
                                                }`}
                                                rows={3}
                                            />
                                        ) : (
                                            <p className="text-lg leading-relaxed">
                                                {prayer}
                                            </p>
                                        )}
                                    </div>
                                ))}
                                {editingContent === "prayer" && (
                                    <button
                                        onClick={addPrayerPoint}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                    >
                                        <Plus size={16} /> Add Prayer Point
                                    </button>
                                )}
                            </div>
                        )}
                        {activeTab === "manage" && isPaid && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold">
                                        Manage Scriptures
                                    </h3>
                                    <button
                                        onClick={() => setEditMode(!editMode)}
                                        className={`${
                                            editMode
                                                ? "bg-red-600 hover:bg-red-700"
                                                : "bg-green-600 hover:bg-green-700"
                                        } text-white px-4 py-2 rounded-lg transition flex items-center gap-2`}
                                    >
                                        {editMode ? (
                                            <>
                                                <X size={16} /> Cancel
                                            </>
                                        ) : (
                                            <>
                                                <Edit2 size={16} /> Add New
                                            </>
                                        )}
                                    </button>
                                </div>
                                {editMode && (
                                    <div
                                        className={`${
                                            darkMode
                                                ? "bg-gray-700"
                                                : "bg-blue-50"
                                        } p-6 rounded-lg space-y-4`}
                                    >
                                        <input
                                            type="text"
                                            value={newVerse.reference}
                                            onChange={(e) =>
                                                setNewVerse({
                                                    ...newVerse,
                                                    reference: e.target.value,
                                                })
                                            }
                                            placeholder="Scripture Reference (e.g., John 3:16)"
                                            className={`w-full px-4 py-2 rounded-lg border ${
                                                darkMode
                                                    ? "bg-gray-800 border-gray-600"
                                                    : "bg-white border-gray-300"
                                            }`}
                                        />
                                        {(
                                            [
                                                "KJV",
                                                "NKJV",
                                                "NIV",
                                                "ESV",
                                                "AMP",
                                                "NLT",
                                            ] as const
                                        ).map((version) => (
                                            <div key={version}>
                                                <label className="block font-semibold mb-2">
                                                    {version}
                                                </label>
                                                <textarea
                                                    value={
                                                        newVerse.versions[
                                                            version
                                                        ] || ""
                                                    }
                                                    onChange={(e) =>
                                                        updateVerseVersion(
                                                            version,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={`Enter ${version} text...`}
                                                    rows={3}
                                                    className={`w-full px-4 py-2 rounded-lg border ${
                                                        darkMode
                                                            ? "bg-gray-800 border-gray-600"
                                                            : "bg-white border-gray-300"
                                                    }`}
                                                />
                                            </div>
                                        ))}
                                        <button
                                            onClick={addNewScripture}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition flex items-center gap-2"
                                        >
                                            <Save size={16} /> Save Scripture
                                        </button>
                                    </div>
                                )}
                                <div className="space-y-3">
                                    {Object.keys(scriptureDB).map(
                                        (reference) => (
                                            <div
                                                key={reference}
                                                className={`${
                                                    darkMode
                                                        ? "bg-gray-700"
                                                        : "bg-white border border-gray-200"
                                                } p-4 rounded-lg`}
                                            >
                                                <h4 className="font-bold text-lg mb-2">
                                                    {reference}
                                                </h4>
                                                <button
                                                    onClick={() =>
                                                        showBibleVersions(
                                                            reference
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                    View All Versions →
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === "manage" && !isPaid && (
                            <div className="text-center py-12">
                                <Lock
                                    size={64}
                                    className="mx-auto mb-4 text-purple-400"
                                />
                                <h3 className="text-2xl font-bold mb-4">
                                    Premium Feature
                                </h3>
                                <p className="mb-6">
                                    Upgrade to Premium to access scripture
                                    management
                                </p>
                                <button
                                    onClick={() => setShowPaymentGate(true)}
                                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold"
                                >
                                    Unlock Now
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {showVerseModal && selectedVerse && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={() => setShowVerseModal(false)}
                >
                    <div
                        className={`${
                            darkMode ? "bg-gray-800" : "bg-white"
                        } rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-bold">
                                    {selectedVerse}
                                </h3>
                                <button
                                    onClick={() => setShowVerseModal(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                            {(
                                [
                                    "KJV",
                                    "NKJV",
                                    "NIV",
                                    "ESV",
                                    "AMP",
                                    "NLT",
                                ] as const
                            ).map((version) => (
                                <button
                                    key={version}
                                    onClick={() => changeBibleVersion(version)}
                                    disabled={verseLoading}
                                    className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                                        bibleVersion === version
                                            ? "bg-blue-600 text-white"
                                            : darkMode
                                            ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                    } ${
                                        verseLoading
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    {version}
                                </button>
                            ))}
                        </div>
                        <div
                            className="p-6 overflow-y-auto"
                            style={{ maxHeight: "calc(85vh - 180px)" }}
                        >
                            {verseLoading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="relative w-16 h-16 mb-4">
                                        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                                    </div>
                                    <p className="text-gray-500 animate-pulse">
                                        Loading scripture...
                                    </p>
                                </div>
                            ) : selectedVerse &&
                              scriptureDB[selectedVerse] &&
                              scriptureDB[selectedVerse][bibleVersion] ? (
                                <div className="text-lg leading-relaxed animate-fadeIn">
                                    {formatScriptureText(
                                        scriptureDB[selectedVerse][bibleVersion]
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">
                                    Translation not available
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SundaySchoolApp;
