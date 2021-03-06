package kr.co.leehana.dto;

import kr.co.leehana.annotation.ValidGameNumber;
import kr.co.leehana.enums.GameRole;
import kr.co.leehana.model.Player;
import kr.co.leehana.model.Setting;
import lombok.Data;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Map;
import java.util.Set;

/**
 * @author Hana Lee
 * @since 2016-01-31 20:35
 */
public class GameRoomDto {

	@Data
	public static class Create {

		@NotBlank
		@Size(min = 2, max = 20)
		private String name;

		@NotNull
		private GameRole gameRole;

		private Player owner;

		private Integer roomNumber;

		@NotNull
		private Setting setting;
	}

	@Data
	public static class Update {
		private String name;
		private Player owner;
		private Set<Player> players;
		private Setting setting;
		private Integer gameCount;
		private Map<Integer, Player> playerRankMap;
	}

	@Data
	public static class Join {
		@NotNull
		private GameRole gameRole;
	}

	@Data
	public static class ChangeOwner {

		@NotNull
		private Long oldOwnerId;

		@NotNull
		private Long newOwnerId;
	}

	@Data
	@ValidGameNumber
	public static class GameNumber {

		@NotNull
		private Long gameRoomId;

		private kr.co.leehana.model.GameNumber number;
	}
}
