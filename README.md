
    🚀 Ce que fait se bot discord :

✅ Télécharge les images ET les vidéos (MP4, GIF, etc.)
✅ Classe les fichiers par catégorie de salon
✅ Crée un dossier media/Catégorie/Salon/images/ pour les images
✅ Crée un dossier media/Catégorie/Salon/videos/ pour les vidéos
✅ Gère les noms de fichiers et de dossiers interdits
✅ Se déconnecte après l'exécution


Étape 1 : Configurer un bot Discord
    Allez sur le portail des développeurs Discord : Discord Developer Portal.
    Créez une nouvelle application et donnez-lui un nom.
    Sous l'onglet "Bot", créez un bot.
    Copiez le token du bot, vous en aurez besoin pour l'authentification.


Étape 2 : Installer les dépendances nécessaires
    Assurez-vous d'avoir Node.js installé. Ensuite, dans votre terminal, 
    initialisez un projet npm et installez les dépendances discord.js et node-fetch :

npm init -y
npm install discord.js node-fetch


Étape 3 : Créer le dossier pour les images
    Assurez-vous de créer un dossier nommé images dans le même répertoire que votre script index.js pour stocker les images téléchargées.


Étape 4 : Lancer le bot
    Dans le terminal, lancez le bot avec la commande :

    node index.js
