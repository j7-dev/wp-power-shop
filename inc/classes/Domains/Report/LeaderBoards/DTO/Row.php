<?php

declare(strict_types=1);

namespace J7\PowerShop\Domains\Report\LeaderBoards\DTO;

/**
 * Row
 */
final class Row {

	/** @var string 名稱 - 商品名稱或用戶名稱 */
	public string $name;

	/** @var int 數量 */
	public int $count;

	/** @var float 金額 */
	public float $total;

	/**
	 * Constructor
	 *
	 * @param array{
	 *    0: array{
	 *        display: string,
	 *        value: string
	 *        format?:string
	 *    },
	 *    1: array{
	 *        display: string,
	 *        value: int
	 *        format?:string
	 *    },
	 *    2: array{
	 *        display: string,
	 *        value: float
	 *        format?:string
	 *    },
	 * } $row
	 */
	public function __construct( $row ) {
		$this->name  = isset($row[0]['value']) ? (string) $row[0]['value'] : '';
		$this->count = isset($row[1]['value']) ? (int) $row[1]['value'] : 0;
		$this->total = isset($row[2]['value']) ? (float) $row[2]['value'] : 0.0;
	}

	/**
	 * 轉換為陣列
	 *
	 * @return array{
	 *     name: string,
	 *     count: int,
	 *     total: float
	 * }
	 */
	public function to_array(): array {
		return [
			'name'  => $this->name,
			'count' => $this->count,
			'total' => $this->total,
		];
	}
}
