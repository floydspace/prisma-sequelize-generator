import fs from 'fs';
import path from 'path';

type ItemType = 'd' | 'f' | 'l';
type Handler = (base: string, item: string, type: ItemType) => boolean | string;

/**
 * Transform a dirent to a file type
 * @param dirent
 * @returns
 */
function direntToType(dirent: fs.Dirent | fs.Stats) {
  return dirent.isFile() ? 'f' : dirent.isDirectory() ? 'd' : dirent.isSymbolicLink() ? 'l' : undefined;
}

/**
 * Is true if at least one matched
 * @param string to match aigainst
 * @param regexs to be matched with
 * @returns
 */
function isMatched(string: string, regexs: (RegExp | string)[]) {
  for (const regex of regexs) {
    if (typeof regex === 'string') {
      if (string.includes(regex)) {
        return true;
      }
    } else if (regex.exec(string)) {
      return true;
    }
  }

  return false;
}

/**
 * Find paths that match a set of regexes
 * @param root to start from
 * @param match to match against
 * @param types to select files, folders, links
 * @param deep to recurse in the directory tree
 * @param limit to limit the results
 * @param handler to further filter results
 * @param found to add to already found
 * @param seen to add to already seen
 * @returns found paths (symlinks preserved)
 */
export function findSync(
  root: string,
  match: (RegExp | string)[],
  types: ('f' | 'd' | 'l')[] = ['f', 'd', 'l'],
  deep: ('d' | 'l')[] = [],
  limit: number = Infinity,
  handler: Handler = () => true,
  found: string[] = [],
  seen: Record<string, true> = {}
) {
  try {
    const realRoot = fs.realpathSync(root);

    // we make sure not to loop infinitely
    if (seen[realRoot]) {
      return found;
    }

    // we stop if we found enough results
    if (limit - found.length <= 0) {
      return found;
    }

    // we check that the root is a directory
    if (direntToType(fs.statSync(realRoot)) !== 'd') {
      return found;
    }

    // we list the items in the current root
    const items = fs.readdirSync(root, { withFileTypes: true });

    //seen[realRoot] = true
    for (const item of items) {
      // we get the file info for each item
      const itemName = item.name;
      const itemType = direntToType(item);
      const itemPath = path.join(root, item.name);

      // if the item is one of the selected
      if (itemType && types.includes(itemType)) {
        // if the path of an item has matched
        if (isMatched(itemPath, match)) {
          const value = handler(root, itemName, itemType);

          // if we changed the path value
          if (typeof value === 'string') {
            found.push(value);
          }
          // if we kept the default path
          else if (value === true) {
            found.push(itemPath);
          }
        }
      }

      if (deep.includes(itemType as any)) {
        // dive within the directory tree
        // we recurse and continue mutating `found`
        findSync(itemPath, match, types, deep, limit, handler, found, seen);
      }
    }
  } catch {}

  return found;
}
