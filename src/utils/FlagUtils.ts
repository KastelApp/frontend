class FlagUtils<
	T extends {
		[key: string]: bigint;
	},
> {
	public bits: bigint;

	public Flags:
		| T
		| {
				[key: string]: bigint;
		  };

	public constructor(
		bits: bigint | number | string,
		flags:
			| T
			| {
					[key: string]: bigint;
			  },
	) {
		this.bits = BigInt(bits);

		this.Flags = flags;
	}

	/**
	 * Check's if a bit is present
	 * @param bit The bit to check
	 * @returns If the bit is present
	 */
	public has(bit: bigint | number | keyof (typeof this)["Flags"]) {
		const bits = typeof bit === "string" ? (this.Flags[bit] ?? 0n) : BigInt(bit as number);

		if (bits === 0n) return false; // No bit is able to be 0

		return (this.bits & bits) === bits;
	}

	/**
	 * Add a bit to the instance
	 * @param bit The bit to add
	 * @returns the instance
	 */
	public add(bit: bigint | number | keyof (typeof this)["Flags"]): this {
		const bits = typeof bit === "string" ? (this.Flags[bit] ?? 0n) : BigInt(bit as number);

		if (this.has(bits)) return this;

		this.bits |= bits;

		return this;
	}

	/**
	 * Removes a bit from the instance
	 * @param bit The bit to remove
	 * @returns the instance
	 */
	public remove(bit: bigint | number | keyof (typeof this)["Flags"]): this {
		const bits = typeof bit === "string" ? (this.Flags[bit] ?? 0n) : BigInt(bit as number);

		if (!this.has(bits)) return this;

		this.bits ^= bits;

		return this;
	}

	public serialize(): bigint {
		return this.bits;
	}

	/**
	 * Return's an array of all the bits in a string format
	 * @returns An array of all the bits
	 */
	public toArray(): (keyof (typeof this)["Flags"])[] {
		return Object.entries(this.Flags)
			.filter(([, value]) => this.has(value))
			.map(([key]) => key) as (keyof (typeof this)["Flags"])[];
	}

	/**
	 * Returns a list of all the bits in a JSON format with a boolean if it is present or not
	 * @returns A list of all the bits in a JSON format
	 */
	public toJSON(): Record<keyof (typeof this)["Flags"], boolean> {
		return Object.fromEntries(Object.entries(this.Flags).map(([key, value]) => [key, this.has(value)])) as Record<
			keyof (typeof this)["Flags"],
			boolean
		>;
	}

	/**
	 * Check's if all the bits are present
	 * @param bits The bits you want to check
	 * @returns If all the bits are present
	 */
	public hasArray(bits: (keyof (typeof this)["Flags"])[]) {
		return bits.every((bit) => this.has(bit));
	}

	/**
	 * Check's if one of the bits is present
	 * @param bits The amount of bits you want to check
	 * @returns If one of the bits is present
	 */
	public hasOneArray(bits: (keyof (typeof this)["Flags"])[]) {
		return bits.some((bit) => this.has(bit));
	}

	public clean(bits: (keyof (typeof this)["Flags"])[]) {
		let finishedBits = 0n;

		for (const bit of bits) {
			if (this.has(bit)) finishedBits |= this.Flags[bit as string] ?? 0n;
		}

		return finishedBits;
	}

	public get cleaned() {
		return Object.keys(this.Flags).reduce<bigint>((bits, key) => {
			let newBits = bits;

			if (this.has(this.Flags[key] ?? 0n)) newBits |= this.Flags[key] ?? 0n;

			return newBits;
		}, 0n);
	}

	public get count() {
		return this.toArray().length;
	}
}

export default FlagUtils;
