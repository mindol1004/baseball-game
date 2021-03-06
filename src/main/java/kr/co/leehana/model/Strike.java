package kr.co.leehana.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.io.Serializable;

/**
 * @author Hana Lee
 * @since 2015-12-20 16:01
 */
@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = {"id"})
@ToString
public class Strike implements Serializable {

	private static final long serialVersionUID = -1013938791583663424L;

	@Id
	@GeneratedValue
	@Column(name = "strike_id")
	@Setter(AccessLevel.NONE)
	private Long id;

	private Integer value;

	public Strike(Integer value) {
		this.value = value;
	}
}