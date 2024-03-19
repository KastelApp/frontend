/* eslint-disable @typescript-eslint/no-explicit-any */
class StringFormatter {
  public static colors = {
    reset: {
      name: "%reset%",
      value: "color: white;",
    },
    purple: {
      name: "%purple%",
      value: "color: purple;",
    },
    orange: {
      name: "%orange%",
      value: "color: orange;",
    },
    green: {
      name: "%green%",
      value: "color: green;",
    },
    red: {
      name: "%red%",
      value: "color: red;",
    },
    blue: {
      name: "%blue%",
      value: "color: blue;",
    },
    yellow: {
      name: "%yellow%",
      value: "color: yellow;",
    },
    cyan: {
      name: "%cyan%",
      value: "color: cyan;",
    },
    white: {
      name: "%white%",
      value: "color: white;",
    },
  };

  private static logString(str: string) {
    let finalString = "";

    const colors = [];

    const split = str.split("%");

    for (const sit of split) {
      if (sit === "") {
        continue;
      }

      if (sit in this.colors) {
        const color = this.colors[sit as keyof typeof this.colors];

        colors.push(color.value);
      } else {
        finalString += `%c${sit}`;
      }
    }

    if (colors.length === 0) {
      return [finalString.replaceAll("%c", ""), []];
    }

    return [finalString, colors];
  }

  public static log(...args: any[]) {
    const combined = args.map((arg, index) => ({
      index,
      data:
        typeof arg === "string"
          ? this.logString(arg)
          : Array.isArray(arg)
            ? [[arg]]
            : arg,
    }));

    const result = combined.reduce<any[]>((acc, { index, data }) => {
      acc[index] = Array.isArray(data) ? data.flat(1) : data;

      return acc;
    }, []);

    console.log(...result.flat(1));
  }

  public static purple(str: string) {
    return `${this.colors.purple.name}${str}`;
  }

  public static orange(str: string) {
    return `${this.colors.orange.name}${str}`;
  }

  public static green(str: string) {
    return `${this.colors.green.name}${str}`;
  }

  public static red(str: string) {
    return `${this.colors.red.name}${str}`;
  }

  public static blue(str: string) {
    return `${this.colors.blue.name}${str}`;
  }

  public static yellow(str: string) {
    return `${this.colors.yellow.name}${str}`;
  }

  public static cyan(str: string) {
    return `${this.colors.cyan.name}${str}`;
  }

  public static white(str: string) {
    return `${this.colors.white.name}${str}`;
  }
}

export default StringFormatter;

export { StringFormatter };
