# _Project_

_This project serves as a marketing tool for the CeBit. Users can start a Indigitus server and login via an emulated terminal_

## Project Setup

_Dependencies_

1. npm install grunt -g 
2. npm install bower -g 
3. git clone https://github.com/LAB75JP/indigitus-marketingfrontend.git
4. cd indigitus-marketingfrontend
5. npm install
6. bower install 
7. grunt serve

_Additional Dependencies_

1. Livereload https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei

## Testing

1. sudo apt-get install ssh
2. sudo adduser devtest
3. Follow the wizard and finally enter "devtest" as password
4. sudo adduser devtest ssh
5. grunt serve

_Not yet implemented_

## Deploying

 _Not yet implemented_

## Contributing changes

- _For new features open up a new branch that gives an idea about what problem you are trying to solve_
- _"Please open github issues"_

## SSH-Keys

- all required SSH keys are located in the *./lib/config/ssh/$environment/* folder.
- no password
- private key is $environment/$template.id\_rsa
- public key is $environment/$template.id\_rsa.pub
- they are all assigned to indigitus@lab75.jp

1. cd lib/config/production
2. ssh-keygen
3. ./$template.id\_rsa [Enter] # replace $template with the correct value in env.json
4. [Enter] # no passphrase
5. [Enter] # confirm no passphrase
6. Replace the local name@host inside id\_rsa.pub file with indigitus@lab75.jp


enjoy!

ROXANNE


                  .,-:-,,.
                .AMMMHMMHHMII,
              .AMMHHMMMHHMMHMMMHHA.
            .AMHHMMMMHIMMMMMMHMHHHHHL
           .AHHIHHMMHIMMMMMMMHMHHHMHLH:
          ,LHHIIHHHHIHMHMMMMMHMHHHLHHAIA
         ;IHHIHHMMH:IHMHMMMMMMHMHIHLIHHIA
        .:IHHII:':'..:.:IHMHMMHHHHIHHLIHH.
       ,I:AVI::.'. .'.'.::IAHMHMHHIALVAIHA
      ,A:AVI::.'. .   . '.:IAVMMHAVLVAIVHHA
     .II:AHI:.'. .      . ':IAVHMHMAHVHIHHH;
    ,A:H:HI::.  .      . .'.:IAIHHAMAIAHIHHLA
   .AIH:AHI:'.            .'.:IIAHHMMAHHIHHIH,
  .AHI:AHI:.:..            .'.VIIHMHMMAIHIHIIA
  ;HHI:AHI:',,'   .    .,:AHVVL:IIHIHMMHHHIHIM;
  ;AII:HIPPT:TPHA. .  .::''. . .VIHHMHMAHIHI:HM
 ;IAIV:HI::.,,,,:'. .  .,:III::.:VIHHHMMHHHHIIHB
 AIHI:HII:I:VCLTV;:.  ..VK CVTPA::IHMHHMHHIHIHV
.LHH::HIHI:IA.TL/::.  ..'VPTTI:'':IIHHHIHMIIHH'
;IHHIHIHHI:. ' '..:.  ..  .'. ' .':HIHMHHMMHIH
IHMHIHIHHI:.   . .:'  . .. .     .:IHHMMMMMHIV
IHHMIHIHHI:.   ..:'.  .. ':. .  ..:HIHMMMMMHV'
HHMHIHIHHI::. ..::L..:-;. ':.. . .:IHMMHMMHIP
HHMHIIHIHHI:.:. .. :''.   .':.. ..:IHMMMHMHV
HIHMMHHHIHI::. ..,.,, ,,,,,.,:.. .:IHMMHMMM'
IIHHIMHMHIHI::. 'LP:'''''''P/. . .:IHMMMHMV
:IIHHMMHMHHII:.. V:-,,,,-''. .  ..:IMHMMMM'
 'IHHMMHHMHHHA:.''::;;;::/' . . .::IMHMMMM
 ;IHMMMHHHMHMHA:...'''''     . ..::':VHHMH:
 :IHHMMHMHHMMMHA:.. .      . ..::'.'.':VHV
 ;IHIHMHHIHMMHMMMA.. . . ...:::'.'.  .. T,
 :IIHMMHIHIHMMMMMMAAL::.::.::':. .   .    ,:.
 ;HIHHMHHIHHMHMMMMMHMHHIHI::.:.. : .   .   AHAA.
.AHIHMMMHMHMHMMHMMMMHMHII::.:.. . .  .  ..:HMMH:
AHV':HHMHHMHMMMHMMMMMHHI::.:.. ..      . .AOAVA/'-..
:I''VHHMMMHHMMMHMMMMHMHI::... :. .   . ..AOOLV/.:.:.:''--...,.
'  .AHIHHMHHMMMMHMMMMMMMI:.... :.    . .AAVAV/.:. . .:  .    .''''-.
  ,:HIIHHMMHMMMMHMMMMHMHI: .:.:: .  . .:ANOO/.:   .: . .  . ..   .. ',,
 ,;P':IHIHHMMHMMMMMMMMHMI:.  .:.. . ..AVAOV/'   .. .:.. .. .       . HA.
,AH::AHIHHHMHMMMMMMMMMMHMA:. .::. ..:.OAVO/. '...::.::.. .  .        HHA
  ' :IIHIHHMHMMMMMMMMMHMHH:..:::.:..AOAVO/:.'..::.:..::.. .       .  HHH
  .::IHHIHMMHMMMMMMMMHMMHII.:.::'.:AOOAV/..: .:.:..:. . .  .   . . . HHH
 ,IHIHHIHMHMMMMMMMHMMHMV:.::::'. .:AOOVV/:.: .:. ..:.. .  .  ..  . . HHH
.:IHHIHHHMHMMMMMMMMMHMV::....:. .:/AOAV/. .:.:.. .. .   . .  . .. . IHHH
 :IHHHMHMMMHMMMMMMHMHHI::...:...:/AOAV/..: :. :.  ..   .    .  .. . AHHH
AIHMHHMMHMMMMMMMMHMHHII:.. .:. ./OAOV/:..:... .   .    .   .  .. .. HHHH
HIHIHHMMHHMHMMHMHHHIHI::.. . ./AO/A//...:.. .   .    .      . .. .  HHHH
HHV'AHHHMHMHHHHIOIHIIII::..../AO/AV/ ..:.:..   .      .    . .. . ..::VH
V'.:HHHMMHMMHHIHOIHHIII:::../VOAVV/.'...:. . .   .       .  . ..::.::III
 .:HHHHMMHMHHMHOOIIII:I:::./OAHVO/: ..:.. . .  .   .       . .. .::::III
.:HHIHHMHMMMHHIOOIHII:::..OO//AO/.. .::.. .  . .     .    . .. .::::IIIH
HIHIIHHMMHMMMHHIOOIII:::.OOO/AO//..:..:..  . ..  .  .     .. ..I:::IIIHH
IHHIIHHMHMMHHIHI:OOO;:.OO/A:AO//. ...:.. ..  .  .          . .:IAI::IIIH
HHIHHHVVHMMHHIHI:::OOOO:O/.AO//. .. .... . ..  .          . ..:IIAI::IIH
VHHHV'.:HMHHIHHI::.:..A/A:AVO/:. . ... ..  . .   .      . ..:.:IIHAHIIII
 VHV   VHHAIVHI:.'...A/A:AOOV/... . .. .  .   .        . ..:.::IIHMHAIIH
       'VHIHA'.'O:O:W:.:A/AO/.. .. .  .   .  .         .. .:..::IHMMHIII
       :V:I:I:.:... ..:A:IOO:.:.. . .  . ....          . ..:.:::IHHHHHII
       O:I:I::. .. . /A/:IOO::. .. .  ..:::::.        . ..:.::::IHMHHVII
      O.I:.. .  . .:AV.:.IO:::.. .    ..:II::..       .. .:.::::IHMHHIII
     O :I:. .  .  /A:...IOO::.. .. . . ..::.:.       . ...:.::::IHMHVIII
     O.:I.      .AW'. ..IOI::.:.. .. .  .:.:.        . .:..:::::IMHHIIII
    ,::.I.  ..AHW'  ...IOII:I:.:.. .. .. .  .  .    . ..:..:.:::IMMVIIII
   B:I:.:I.AHW'     . :IOII:I::.:... ... .. ..  . . ....::.:.:::IMMHIIII
   'VHHHHV:' .     . :V.OO:I::.:... .:.. ... .. .. ..:::. .::.::AHMVIIII
     V:. .V.    . . :V:HOO:II::.::.:. :.... ..:...::I::. ...::::MHMIIIII
     ':.. .V.. . .:V:.A:OO:III::::::.::..:.:.:I.::::.. . .. .:::MMHIIIII
      ':....V:OOO;V..:W:OO::IIII:II::II:I:I:II:::::.    .. ..:::MHHAIIII
       '::.:..'.'. ..W:.OO.:II:::II::IIII:II:::.:..    .  ...:::MMHMIIII
        ':I:.:.:....W:..OO:::II:::::I::::::..:..    .'.    ..:::MMHVIIII
         ':III::.:.W/::OO:::.:I::I:::::.:.:.. .. .. ..    ...:::MMHIIIII
          OO'WII:::W:I:OO::..:I:::II::..:... .. ... .     ..:::AMMMIIIHH
          'O O'WI:W:II:OO.:..:.:II:::I:..:... ... .      . ..::MHVIIIHHH
           OO'OOOV::II:OO:.. .::.:II::.:.. .. .. .    . .:..::AMMIIIIHHH
            O   II:.:::OO.:.. ...:.:II:.:.. ... . . .  ...:.::HMMIIIIHHH
            OO  A:::.:OO:... . ...:.:I.::.:... . . .  . ..:::AMHMIIIIHHH
            OO AM::.::OO::... . ...:.:.:.:.:..:.. . .. ...::IMMMMIIIIHHH
             O HHM.:.:OO::.. . . .:.:.:.:.:..:... .. .  ..:AMHMMMIHIIHHI
             OOMM..:.:OO.:... . ...:...:..:.:..:.. .. . ..:HHMMHMIHIIHHI
            AMOOV..:.:OO:.:... . . ..:..:..:.::..:.. .. .:AHHMMMMIHIIHHH
           AMMOO.:.:::OO::.:.:.. . .:..:....::..:.::..:.:IHHMMMHVIHHIHHH
          AMMMOO.::.:OO::..:..:.. ...:..:..:..:..:.::.:::IHHMMMHAIHHIHHH
         AMMMM'OO::::OO:::..:... .. ...:..:..:..:.:.:::.:IHHMMMHIHHHIHHH
         MMMV..:OO::OO:::.::.::.... .:...:...:.:..::.::::IHHMMMHIHHHIHHH
        AMM'... .:OOO::::.:::..:..:. ..:. .:..:..:.::::.:::HHMMMIHHIIHHH
       AMM' . .. .:::::.:::.::...:.:. . .. . ..::.::.:::::IIVMMVIHHIIHHH
       MM' .  . .:.:.::I:.:.:.:::..::.. . .. ..::..::.::I:IIIVMIIHHIIHHH
      AM' .. . . .::.:.::I:.::.:.:::..:. . . . ..:..::.:I:IIIIVIHHHIIHHH
     AM' . ... . ..:::.::..::.:::..:..:.. .  .. .:.:.:I:IIIHIIVIHHHIIHHH
    AMV .. .. .  .. .::.::..:.::::.:.:. .. . ... ..:I:IIIHIH:IIHHHHIIHII
   AMV . .. ...  . .:. :.:...:I:..:.:.:.. . .:. ..:.:.:IIHIHH:AHHHHIIHII
  AMM' .. .. ...  ..:::... . NV::..:..:.. .... ..:.:::IIHIHHI:HHHHIIIIII
 AMMV . ... .:.. ..: ..:. . . .  .:..:. . .. .:..::::IIIHIHHI:VHHHHIIIIH
AMMM' .. .:. .... .::..:.. . .. . ..  .. . ..:...:::I:IHIHHHH:I:VHHHHIII
MMMV . ... ... ...::. ...:.. ... . ...:..:..:.:.::I:I:IHIHHVII::HHHHHHIH
MMM'. ... .:..:..:...:... ..:. .. ...:.....::.:.:::I:IHHIHHIII:AHHHHHI'H
MMV .. ....:.::.:..:... ... ..:.... .. ..:.. .:...I:IIHIHHVIII.HHHHHH' H
MMI ... ..::..::...::... . .:..:...:... ...:..:..:::IIIHIHIIIV.HHHHHH AH
MM'.. ... ..::.:::..::...:.:.:. .:...:..:..:.:..::::I:IIHIIII..HHHHHH HH
MM.. .....:.::..::.:.:.::..::.::..::... ...:.::.:::I:IIHIHIII..HHHHHVAHH
MV...: ..:.:::.::.:.:::..:.:.:::.:.:.:.:..:..:::.:::IIHIHIHHV.AHIHHH'AHH
MI.. ..:..::::I:.:.::.:::.:::.:.:::.:.:.:.:.:I:.:::I:IIHIHVHI.HHHHHH.HHH
MI.. . ..:..:::I::.::..:.:.:.:.:.::.::..:.:II::.::::I:IHIIVH:.HHHHHH.HIH
MI... . ..:..:::II::I::.:.I.:.:.:.::.::II:I:.:.:.::I:IIIIVHV:AHHHHHHA IH
MA.:..:. ..:. .::IIHHHI:I.IHI.::I:I:I:I::.::. ..:..::I:IIHHIIHHHHHHHH IH
MM..:...... . .::IHHHIHIIHHIHIIH:IHII:::. .:.. ..:.:::IIAHHIHHHHHHHHV HH
MM.:. .:... .:..:IHHMHWHMHMWMHMHMIIH::..:.. ..:..:.::IIAHHHIHHIHHHHH' IH
MM:..:.:. .. ...::IMMHWMMHMWMMHMHHMI:.:. ... . .::.:IIHAHHHIHIIH HHH  IH
MM::.:. ... .. ..:IMWMMWMWMWMMMWHII.:... ... . ..:.:.:IHIHHIHHIV HHH  IH
MMI::.:. ... .. .::VMMMMWMWMWMMHV:.:.. . . .. ..:.:..:IHIIHHHMM AHHH. IH
MMA:::.:.:. . . ..::VMMMMMWMMMHV:.:... . .  ....:..:.:IHHIHHHHMMMHIHI IH
MMM::::.:.:. . ....::VMMMMMMMV:::.:. . ..  . ... .:..:IHIIHHHHMMMHIHI IH
MMMI:::.:. . ... ...::VMMMWMV::..:... . . . .. .::..:IIHIIHHHHHHHIHHI.'H
MMHM:::..:.. .. ...:.::IWMMV:::.:.. .. . . . ...:.:.:IIHIIHHMHHHHIHHI
MHMMI:::.:. . ... ...:::II:::.:... .. .. . . . :.:.:IIHIIHHHMMHHHIIHII
HIHMA::::.:. .. ... ..::II::.:.:.. . . . .. . :.:.:.IIHIVVIHIIHHHHHHII
IVVMM::::.:.:. . ... .::II:.::..:.. .. .. . . .:.:::IHH:.:HHIIHIHH':-'
'::VMI:::.:.:.. .. . .::II.::.:.:. .. .. . . ..:..::IHH..:HIIIHIHH
    HA::::.:..  ... ...:II.:.:.:... . .. .. ..:..:.:IHII..HHIIHIHI
    HM:::::.:. . .. ...:II.::.:.::.. ...  .  ..:.:::IHIH..HIIIHIH'
   IHMA:::.:... .. .. .:II:.:.::.:.. .. .. .. .:.:::HHIH..VIIIHIH
   HHHM::::.:.. .. ....::II:.:..:.:.. . . . . ..::::HIHH...HIIHHH
   HHMMA::::.:. . .. ..::II.:.:.:.:... . . .. .:.:::HIHHA..HHHHHV
   ''MMM:::::.:. . .. .::II:.:.::.:.. .. .. . .:::::HIHHH..HHHHVI
     VMMI::::.:. ... ..:::II:.:.::.:.. .. . . .:.:::H:HHI...IHHII
      MHA:::.:.. .. ....::II.:.:.::. . ... . . .::::I:HI I..IHHHV
      MMM::::.:. . .. ..::IA:.:.:.:.. .. .. .. ..:::I.H:.I..IHVH
      V'HA:::..:. .. .. ::IIH:.:.:.:.. .. ..  ..:.:I:.II.I.:VV'V
          :::..:... .. .::IIH..:.::.:.. . ... . .:.::.II:I::'III
          ':::.:.. ... .::IIH::.:.:.:. .. .. . .:..::.::.:::  HI
           ::::.:.. .. .::IIH:.:.::.:. . .. . . .:...:.:.:.'  HI
           '::::.. .. ..::IIH::.::.:.:.. ... . . .:.:.:.:.:   II
