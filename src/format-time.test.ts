import { pipe } from "fp-ts/lib/function";
import { describe, test, expect } from "vitest";

const formattingTokensRegExp =
  /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;

const formatter = {
  yyyy: (date: Date) => date.getFullYear().toString(),
  MM: (date: Date) => (date.getMonth() + 1).toString().padStart(2, "0"),
  dd: (date: Date) => date.getDate().toString().padStart(2, "0"),
} as const;

function format(template: string) {
  return (date: Date) =>
    template
      .match(formattingTokensRegExp)
      ?.map((substring) => {
        if (substring in formatter) {
          const type = substring as keyof typeof formatter;
          return formatter[type](date);
        }
        return substring;
      })
      .join("");
}

function toDate(duration: number) {
  return new Date(duration);
}

describe("format-time", () => {
  test(`
    given template MM/dd/yyyy,
    when parameter is Date(2020-01-01T00:00:00.000Z),
    then result is 01/01/2020
  `, () => {
    const result = pipe(
      new Date("2020-01-01T00:00:00.000Z"),
      format("MM/dd/yyyy")
    );

    expect(result).toBe("01/01/2020");
  });

  test(`
    given template MM/dd/yyyy,
    when parameter is 1577836800000,
    then result is 01/01/2020
  `, () => {
    const result = pipe(
      1577836800000,
      toDate,
      format("MM/dd/yyyy")
      //
    );

    expect(result).toBe("01/01/2020");
  });
});
