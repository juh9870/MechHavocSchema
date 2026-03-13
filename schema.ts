import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const typeMap: Record<string, string> = {
    "int": "integer",
    "string": "string",
    "float": "number",
    "bool": "boolean",
};

function readInProps(data: string, non_required: string[]) {
    type Entry = {
        type?: string;
        title?: string;
        description?: string;
    };

    let found_start = false;
    const entries: Record<string, Entry> = {};
    let cur_entry: Entry = {};
    let cur_name = "";

    let skip_next = false;

    for (let line of data.split(/[\n\r]/)) {
        line = line.trim();

        if (line === "Notes") {
            found_start = true;
            continue;
        }

        if (line.startsWith('"')) found_start = true;

        if (!found_start) continue;

        if (line === "") {
            skip_next = true;
            continue;
        }

        if (skip_next) {
            skip_next = false;
            continue;
        }

        if (line.startsWith('"')) {
            if (cur_name !== "") {
                entries[cur_name] = cur_entry;
                cur_name = "";
            }

            cur_name = line.substring(1, line.length - 1);
            cur_entry = {};
        } else {
            if (!("type" in cur_entry)) {
                cur_entry.type = typeMap[line] ?? line;
            } else if ("title" in cur_entry) {
                if ("description" in cur_entry) {
                    cur_entry.description += `\n${line}`;
                } else {
                    cur_entry.description = line;
                }
            } else {
                cur_entry.title = line;
            }
        }
    }

    entries[cur_name] = cur_entry;
    return {
        type: "object",
        additionalProperties: false,
        properties: entries,
        required: Object.keys(entries).filter((k) => !non_required.includes(k)),
    };
}

for (const file of readdirSync("inputs")) {
    const data = readFileSync(`./inputs/${file}`).toString();
    if (file.includes(".multi")) {
        const chunks = data.split(/[\n\r]{2,}/);
        for (const chunk of chunks) {
            const name = chunk.split(/[\n\r]/, 2)[0].trim();
            writeFileSync(
                `./outputs/${file}.${name}.json`,
                JSON.stringify(readInProps(chunk, []), null, "\t"),
            );
        }
    } else {
        writeFileSync(
            `./outputs/${file}.json`,
            JSON.stringify(readInProps(data, []), null, "\t"),
        );
    }
}
