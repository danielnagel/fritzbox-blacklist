import { readFile, writeFile } from 'fs/promises';

try {
  const controller = new AbortController();
  const encoding = "utf-8";
  const signal = controller.signal;
  const content =  await readFile("hosts.txt", { encoding, signal });

  const contentLines = content.split("\n");
  const blacklist = [];
  for(let i = 0; i < contentLines.length; i++) {
      let line = contentLines[i];
      
      if(!line) continue;
      if(line.startsWith("#")) continue;

      line = line.replace("0.0.0.0 ", "");

      const hash = line.indexOf("#");
      if(hash > 0) {
	line = line.substring(0, hash);
      }

      blacklist.push(line.trim());
  }

  await writeFile('blacklist.txt', blacklist.join(" "), { encoding, signal });

  // Abort the request
  controller.abort();
} catch (err) {
  console.error(err);
}
