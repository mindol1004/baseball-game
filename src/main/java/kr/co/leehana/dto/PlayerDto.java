package kr.co.leehana.dto;

import kr.co.leehana.model.AttackerRoleCount;
import kr.co.leehana.model.DefenderRoleCount;
import kr.co.leehana.model.Level;
import kr.co.leehana.model.MatchRecord;
import kr.co.leehana.model.TotalRank;
import lombok.Data;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.Date;

/**
 * @author Hana Lee
 * @since 2016-01-28 17:13
 */
public class PlayerDto {

	@Data
	public static class Create {
		private static final String EMAIL_PATTERN = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*" +
				"@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";

		@NotBlank
		@Pattern(regexp = EMAIL_PATTERN)
		private String email;

		@NotBlank
		@Size(min = 2, max = 20)
		private String nickname;

		@NotBlank
		@Size(min = 4, max = 41)
		private String password;
	}

	@Data
	public static class Response {
		private Long id;
		private String nickname;
		private String email;
		private Level level;
		private TotalRank totalRank;
		private MatchRecord matchRecord;
		private DefenderRoleCount defenderRoleCount;
		private AttackerRoleCount attackerRoleCount;
		private Date joined;
		private Date updated;
	}

	@Data
	public static class Update {
		private String email;
		private String password;
		private String nickname;
		private Level level;
		private TotalRank totalRank;
		private MatchRecord matchRecord;
		private DefenderRoleCount defenderRoleCount;
		private AttackerRoleCount attackerRoleCount;
	}
}
